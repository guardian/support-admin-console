import { join } from 'path';
import { GuEc2App } from '@guardian/cdk';
import { AccessScope } from '@guardian/cdk/lib/constants';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import { GuCname } from '@guardian/cdk/lib/constructs/dns';
import {
  GuAllowPolicy,
  GuGetS3ObjectsPolicy,
  GuPutS3ObjectsPolicy,
} from '@guardian/cdk/lib/constructs/iam';
import type { App } from 'aws-cdk-lib';
import { Duration, Tags } from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType } from 'aws-cdk-lib/aws-ec2';
import type { CfnLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancing';
import { CfnInclude } from 'aws-cdk-lib/cloudformation-include';

interface AdminConsoleProps extends GuStackProps {
  domainName: string;
}

export class AdminConsole extends GuStack {
  constructor(scope: App, id: string, props: AdminConsoleProps) {
    super(scope, id, props);

    const { domainName } = props;

    const app = 'admin-console';

    const userData = `#!/bin/bash -ev
    aws --region ${this.region} s3 cp s3://membership-dist/${this.stack}/${this.stage}/${app}/support-admin-console_1.0-SNAPSHOT_all.deb /tmp
    dpkg -i /tmp/support-admin-console_1.0-SNAPSHOT_all.deb
    /opt/cloudwatch-logs/configure-logs application ${this.stack} ${this.stage} ${app} /var/log/support-admin-console/application.log`;

    const policies = [
      new GuAllowPolicy(this, 'Cloudwatch', {
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
        resources: ['arn:aws:logs:*:*:*'],
      }),
      new GuAllowPolicy(this, 'SSMGet', {
        actions: ['ssm:GetParametersByPath'],
        resources: [`arn:aws:ssm:${this.region}:${this.account}:parameter/${app}/${this.stage}`],
      }),
      new GuGetS3ObjectsPolicy(this, 'SettingsBucketGet', {
        bucketName: 'support-admin-console',
        paths: [`${this.stage}/*`, 'google-auth-service-account-certificate.json'],
      }),
      new GuPutS3ObjectsPolicy(this, 'SettingsBucketPut', {
        bucketName: 'support-admin-console',
        paths: [`${this.stage}/*`],
      }),
      new GuPutS3ObjectsPolicy(this, 'PublicSettingsBucketPut', {
        bucketName: 'gu-contributions-public',
        paths: [`epic/${this.stage}/*`, `banner/${this.stage}/*`, `header/${this.stage}/*`],
      }),
    ];

    const ec2App = new GuEc2App(this, {
      applicationPort: 9000,
      app: 'admin-console',
      access: { scope: AccessScope.PUBLIC },
      certificateProps: {
        domainName,
      },
      monitoringConfiguration: {
        noMonitoring: true,
      },
      userData,
      roleConfiguration: {
        additionalPolicies: policies,
      },
      scaling: { minimumInstances: 1, maximumInstances: 2 },
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      withoutImdsv2: true,
    });

    // TODO Remove this tag after the migration
    const ec2AppAsg = ec2App.autoScalingGroup;
    Tags.of(ec2AppAsg).add('gu:riffraff:new-asg', 'true');

    // TODO Legacy cloudformation stack - to be removed after migration to cdk is complete
    const yamlTemplateFilePath = join(__dirname, '../..', 'cloudformation.yaml');
    const template = new CfnInclude(this, 'YamlTemplate', {
      templateFile: yamlTemplateFilePath,
    });

    // TODO Migrate to new LB
    const oldElb = template.getResource('ElasticLoadBalancer') as CfnLoadBalancer;
    new GuCname(this, 'cname', {
      app,
      domainName,
      ttl: Duration.minutes(60),
      resourceRecord: oldElb.attrDnsName,
    });
  }
}
