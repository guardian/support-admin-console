import { randomBytes } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { prodProps } from '../bin/cdk';
import { AdminConsole } from './admin-console';

describe('The AdminConsole stack', () => {
  it.each(['CODE', 'PROD'])('schedules daily rotation in %s with scoped write access and no automatic retries', (stage) => {
    const stack = new AdminConsole(new App(), 'AdminConsole', { ...prodProps, stage });
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::SQS::Queue', 1);
    template.hasResourceProperties('AWS::SQS::Queue', {
      QueueName: `admin-console-${stage}-play-secret-rotation-failures`,
      MessageRetentionPeriod: 14 * 24 * 60 * 60,
    });
    const queueId = Object.keys(template.findResources('AWS::SQS::Queue'))[0];
    const deadLetterConfig = { TargetArn: { 'Fn::GetAtt': [queueId, 'Arn'] } };
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: `admin-console-${stage}-play-secret-rotation`,
      Handler: 'index.handler',
      Runtime: 'nodejs24.x',
      Code: {
        ZipFile: Match.anyValue(),
      },
      ReservedConcurrentExecutions: 1,
      Environment: { Variables: { PARAMETER_NAME: `/admin-console/${stage}/play.http.secret.key` } },
      DeadLetterConfig: deadLetterConfig,
    });
    template.hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
      MaximumRetryAttempts: 0,
      MaximumEventAgeInSeconds: 3600,
    });
    template.hasResourceProperties('AWS::Events::Rule', {
      ScheduleExpression: 'rate(1 day)',
      Targets: Match.arrayWith([
        Match.objectLike({
          RetryPolicy: { MaximumRetryAttempts: 0, MaximumEventAgeInSeconds: 3600 },
          DeadLetterConfig: { Arn: deadLetterConfig.TargetArn },
        }),
      ]),
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['ssm:GetParameter', 'ssm:PutParameter']),
            Resource: {
              'Fn::Join': ['', ['arn:aws:ssm:eu-west-1:', { Ref: 'AWS::AccountId' }, `:parameter/admin-console/${stage}/play.http.secret.key`]],
            },
          }),
        ]),
      },
    });
    template.resourceCountIs('AWS::CloudWatch::Alarm', stage === 'PROD' ? 4 : 0);
    if (stage === 'PROD') {
      const alarmActions = [
        stack.resolve(stack.formatArn({ service: 'sns', resource: 'alarms-handler-topic-PROD' })),
      ];
      template.hasResourceProperties('AWS::CloudWatch::Alarm', {
        AlarmDescription: `${stage} Play secret rotation failed; inspect Lambda logs and the failure queue.`,
        AlarmActions: alarmActions,
        Namespace: 'AWS/Lambda',
        MetricName: 'Errors',
        Threshold: 1,
        EvaluationPeriods: 1,
      });
      template.hasResourceProperties('AWS::CloudWatch::Alarm', {
        AlarmDescription: `${stage} Play secret rotation failure queue contains an event; investigate before replaying.`,
        AlarmActions: alarmActions,
        Namespace: 'AWS/SQS',
        MetricName: 'ApproximateNumberOfMessagesVisible',
        Threshold: 1,
        EvaluationPeriods: 1,
      });
    }
  });

  describe('the inline rotation handler', () => {
    const parameterName = '/admin-console/CODE/play.http.secret.key';
    const template = Template.fromStack(
      new AdminConsole(new App(), 'AdminConsole', { ...prodProps, stage: 'CODE' }),
    );
    const functions = template.findResources('AWS::Lambda::Function');
    const rotationFunction = Object.values(functions)[0] as {
      Properties: { Code: { ZipFile: string } };
    };
    const source = rotationFunction.Properties.Code.ZipFile;

    const loadHandler = (
      send: jest.Mock,
      environment: Record<string, string>,
      now: () => number = Date.now,
    ) => {
      const clientConstructor = jest.fn().mockImplementation(() => ({ send }));
      const getParameterCommandConstructor = jest.fn((input: {
        Name: string;
        WithDecryption: boolean;
      }) => ({ operation: 'get', input }));
      const commandConstructor = jest.fn((input: {
        Name: string;
        Value: string;
        Type: string;
        KeyId: string;
        Overwrite: boolean;
      }) => ({ operation: 'put', input }));
      const exports = {
        handler: (_event?: { id: string }): Promise<void> => {
          void _event;
          return Promise.resolve();
        },
      };
      runInNewContext(source, {
        exports,
        Date: { now },
        console: { info: jest.fn() },
        process: { env: environment },
        require: (moduleName: string) => {
          if (moduleName === 'node:crypto') {
            return { randomBytes };
          }
          if (moduleName === '@aws-sdk/client-ssm') {
            return {
              SSMClient: clientConstructor,
              GetParameterCommand: getParameterCommandConstructor,
              PutParameterCommand: commandConstructor,
            };
          }
          throw new Error(`Unexpected module: ${moduleName}`);
        },
      });
      return {
        handler: exports.handler,
        clientConstructor,
        getParameterCommandConstructor,
        commandConstructor,
      };
    };

    it('writes a fresh random SecureString when the last update is outside the cooldown', async () => {
      const lastModifiedDate = new Date(Date.now() - 123 * 60 * 1000 - 1);
      const send = jest.fn((command: { operation: string }) =>
        Promise.resolve(
          command.operation === 'get' ? { Parameter: { LastModifiedDate: lastModifiedDate } } : {},
        ),
      );
      const { handler, clientConstructor, getParameterCommandConstructor, commandConstructor } = loadHandler(send, {
        PARAMETER_NAME: parameterName,
      });

      await handler();

      expect(clientConstructor).toHaveBeenCalledWith({ maxAttempts: 1 });
      expect(getParameterCommandConstructor).toHaveBeenCalledWith({
        Name: parameterName,
        WithDecryption: false,
      });
      const parameter = commandConstructor.mock.calls[0][0];
      expect(parameter).toMatchObject({
        Name: parameterName,
        Type: 'SecureString',
        KeyId: 'alias/aws/ssm',
        Overwrite: true,
      });
      expect(parameter.Value).toMatch(/^[a-f0-9]{64}$/);
      expect(send).toHaveBeenCalledTimes(2);
    });

    it('skips sequential duplicate delivery of the same event while the parameter is in cooldown', async () => {
      let now = Date.now();
      let lastModifiedDate = new Date(now - 123 * 60 * 1000 - 1);
      const send = jest.fn((command: { operation: string }) => {
        if (command.operation === 'get') {
          return Promise.resolve({ Parameter: { LastModifiedDate: lastModifiedDate } });
        }
        lastModifiedDate = new Date(now);
        return Promise.resolve({});
      });
      const event = { id: 'same-event' };
      const environment = { PARAMETER_NAME: parameterName };
      const firstInvocation = loadHandler(send, environment, () => now);
      const duplicateInvocation = loadHandler(send, environment, () => now);

      await firstInvocation.handler(event);
      now += 1000;
      await duplicateInvocation.handler(event);

      expect(send).toHaveBeenCalledTimes(3);
      expect(send.mock.calls.map(([command]) => command.operation)).toEqual([
        'get',
        'put',
        'get',
      ]);
    });

    it('fails without writing when the parameter name is missing', async () => {
      const send = jest.fn();
      const { handler } = loadHandler(send, {});

      await expect(handler()).rejects.toThrow('PARAMETER_NAME is required');
      expect(send).not.toHaveBeenCalled();
    });

    it('propagates SSM failures for Lambda failure handling', async () => {
      const send = jest.fn().mockRejectedValue(new Error('SSM unavailable'));
      const { handler } = loadHandler(send, { PARAMETER_NAME: parameterName });

      await expect(handler()).rejects.toThrow('SSM unavailable');
      expect(send).toHaveBeenCalledTimes(1);
    });
  });

  it('matches the snapshot', () => {
    const app = new App();
    const stack = new AdminConsole(app, 'AdminConsole', prodProps);
    const template = Template.fromStack(stack);
    const templateJson = template.toJSON() as {
      Resources: Record<string, { Properties?: { Tags?: unknown } }>;
    };
    Object.keys(templateJson.Resources)
      .filter(
        (resourceId) =>
          resourceId.startsWith('AllowKnownMethods') ||
          resourceId.startsWith('BlockUnknownMethods'),
      )
      .forEach((resourceId) => {
        delete templateJson.Resources[resourceId].Properties?.Tags;
      });
    expect(templateJson).toMatchSnapshot();
  });
});
