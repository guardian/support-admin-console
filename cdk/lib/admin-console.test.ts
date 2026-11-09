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
    template.resourceCountIs('AWS::SQS::Queue', 0);
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Runtime: 'nodejs24.x',
      Code: {
        ZipFile: Match.anyValue(),
      },
      ReservedConcurrentExecutions: 1,
      Environment: { Variables: { PARAMETER_NAME: `/admin-console/${stage}/play.http.secret.key` } },
      DeadLetterConfig: Match.absent(),
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
          DeadLetterConfig: Match.absent(),
        }),
      ]),
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'ssm:PutParameter',
            Resource: {
              'Fn::Join': ['', ['arn:aws:ssm:eu-west-1:', { Ref: 'AWS::AccountId' }, `:parameter/admin-console/${stage}/play.http.secret.key`]],
            },
          }),
        ]),
      },
    });
    template.resourceCountIs('AWS::CloudWatch::Alarm', stage === 'PROD' ? 2 : 0);
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

    const loadHandler = (send: jest.Mock, environment: Record<string, string>) => {
      const clientConstructor = jest.fn().mockImplementation(() => ({ send }));
      const commandConstructor = jest.fn((input: {
        Name: string;
        Value: string;
        Type: string;
        KeyId: string;
        Overwrite: boolean;
      }) => ({ input }));
      const exports = { handler: async (): Promise<void> => {} };
      runInNewContext(source, {
        exports,
        process: { env: environment },
        require: (moduleName: string) => {
          if (moduleName === 'node:crypto') {
            return { randomBytes };
          }
          if (moduleName === '@aws-sdk/client-ssm') {
            return { SSMClient: clientConstructor, PutParameterCommand: commandConstructor };
          }
          throw new Error(`Unexpected module: ${moduleName}`);
        },
      });
      return { handler: exports.handler, clientConstructor, commandConstructor };
    };

    it('writes fresh random secrets as SecureString versions without SDK retries', async () => {
      const send = jest.fn().mockResolvedValue({});
      const { handler, clientConstructor, commandConstructor } = loadHandler(send, {
        PARAMETER_NAME: parameterName,
      });

      await handler();
      await handler();

      expect(clientConstructor).toHaveBeenCalledWith({ maxAttempts: 1 });
      const firstParameter = commandConstructor.mock.calls[0][0];
      const secondParameter = commandConstructor.mock.calls[1][0];
      expect(firstParameter).toMatchObject({
        Name: parameterName,
        Type: 'SecureString',
        KeyId: 'alias/aws/ssm',
        Overwrite: true,
      });
      expect(firstParameter.Value).toMatch(/^[a-f0-9]{64}$/);
      expect(secondParameter.Value).toMatch(/^[a-f0-9]{64}$/);
      expect(firstParameter.Value).not.toBe(secondParameter.Value);
      expect(send).toHaveBeenCalledTimes(2);
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
