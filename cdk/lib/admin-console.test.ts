import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { prodProps } from '../bin/cdk';
import { AdminConsole } from './admin-console';

describe('The AdminConsole stack', () => {
  it('schedules daily rotation in CODE with scoped write access and no automatic retries', () => {
    const stack = new AdminConsole(new App(), 'AdminConsole', { ...prodProps, stage: 'CODE' });
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'com.gu.play.secretrotation.aws.parameterstore.Lambda::lambdaHandler',
      Runtime: 'java21',
      Code: {
        S3Bucket: 'membership-dist',
        S3Key: 'support/CODE/admin-console/play-secret-rotation/21.0.1/aws-parameterstore-lambda.jar',
      },
      ReservedConcurrentExecutions: 1,
      Environment: { Variables: { PARAMETER_NAME: '/admin-console/CODE/play.http.secret.key' } },
      DeadLetterConfig: { TargetArn: Match.anyValue() },
    });
    template.hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
      MaximumRetryAttempts: 0,
      MaximumEventAgeInSeconds: 3600,
    });
    template.hasResourceProperties('AWS::Events::Rule', {
      ScheduleExpression: 'rate(1 day)',
      Targets: Match.arrayWith([
        Match.objectLike({ RetryPolicy: { MaximumRetryAttempts: 0, MaximumEventAgeInSeconds: 3600 } }),
      ]),
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'ssm:PutParameter',
            Resource: {
              'Fn::Join': ['', ['arn:aws:ssm:eu-west-1:', { Ref: 'AWS::AccountId' }, ':parameter/admin-console/CODE/play.http.secret.key']],
            },
          }),
        ]),
      },
    });
    template.resourceCountIs('AWS::CloudWatch::Alarm', 2);
  });

  it('does not create a rotation Lambda or schedule in PROD', () => {
    const template = Template.fromStack(new AdminConsole(new App(), 'AdminConsole', prodProps));
    template.resourceCountIs('AWS::Lambda::Function', 0);
    template.resourceCountIs('AWS::Events::Rule', 0);
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
