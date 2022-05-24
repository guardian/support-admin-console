import { GuEc2App } from '@guardian/cdk';
import { AccessScope } from '@guardian/cdk/lib/constants';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import { GuCname } from '@guardian/cdk/lib/constructs/dns';
import {
  GuAllowPolicy,
  GuDynamoDBReadPolicy,
  GuDynamoDBWritePolicy,
  GuGetS3ObjectsPolicy,
  GuPutS3ObjectsPolicy,
} from '@guardian/cdk/lib/constructs/iam';
import type { App, CfnElement } from 'aws-cdk-lib';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { BillingMode } from 'aws-cdk-lib/aws-dynamodb/lib/table';
import { InstanceClass, InstanceSize, InstanceType } from 'aws-cdk-lib/aws-ec2';

export interface AdminConsoleProps extends GuStackProps {
  domainName: string;
}

export class AdminConsole extends GuStack {
  // Build a dynamodb table to store tests for all channels
  buildTestsTable(): Table {
    const id = `ChannelTestsDynamoTable`;

    const table = new Table(this, id, {
      tableName: `support-admin-console-channel-tests-${this.stage}`,
      removalPolicy: RemovalPolicy.RETAIN,
      // Use on-demand billing during migration from S3, because we have infrequent spikes when users click save. We can switch to provisioned after
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'channel',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'name',
        type: AttributeType.STRING,
      },
    });

    // Give it a better name
    const defaultChild = table.node.defaultChild as unknown as CfnElement;
    defaultChild.overrideLogicalId(id);

    return table;
  }

  buildDynamoPolicies(table: Table): GuAllowPolicy[] {
    return [
      new GuDynamoDBReadPolicy(this, `DynamoRead-${table.node.id}`, {
        tableName: table.tableName,
      }),
      new GuDynamoDBWritePolicy(this, `DynamoWrite-${table.node.id}`, {
        tableName: table.tableName,
      }),
    ];
  }

  constructor(scope: App, id: string, props: AdminConsoleProps) {
    super(scope, id, props);

    const { domainName } = props;

    const app = 'admin-console';

    const channelTestsDynamoTable = this.buildTestsTable();
    const dynamoPolicies = this.buildDynamoPolicies(channelTestsDynamoTable);

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
      new GuAllowPolicy(this, 'PublicSettingsBucketPut', {
        actions: ['s3:PutObject', 's3:PutObjectAcl'],
        resources: [
          `arn:aws:s3:::gu-contributions-public/epic/${this.stage}/*`,
          `arn:aws:s3:::gu-contributions-public/banner/${this.stage}/*`,
          `arn:aws:s3:::gu-contributions-public/header/${this.stage}/*`,
        ],
      }),
      ...dynamoPolicies,
    ];

    const ec2App = new GuEc2App(this, {
      applicationPort: 9000,
      app,
      access: { scope: AccessScope.PUBLIC },
      certificateProps: {
        domainName,
      },
      monitoringConfiguration: {
        http5xxAlarm: {
          tolerated5xxPercentage: 0,
          numberOfMinutesAboveThresholdBeforeAlarm: 1,
          alarmName: `5XX error returned by ${app} ${this.stage}`,
        },
        unhealthyInstancesAlarm: true,
        snsTopicName: 'marketing-dev',
      },
      userData,
      roleConfiguration: {
        additionalPolicies: policies,
      },
      scaling: { minimumInstances: 1, maximumInstances: 2 },
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      withoutImdsv2: true,
    });

    new GuCname(this, 'cname', {
      app,
      domainName,
      ttl: Duration.minutes(60),
      resourceRecord: ec2App.loadBalancer.loadBalancerDnsName,
    });
  }
}
