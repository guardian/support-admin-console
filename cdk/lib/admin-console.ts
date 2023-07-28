import { GuEc2App } from '@guardian/cdk';
import { AccessScope } from '@guardian/cdk/lib/constants';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack, GuStringParameter } from '@guardian/cdk/lib/constructs/core';
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
import { AttributeType, BillingMode, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { InstanceClass, InstanceSize, InstanceType } from 'aws-cdk-lib/aws-ec2';
import type { Policy } from 'aws-cdk-lib/aws-iam';
import { AccountPrincipal, ManagedPolicy, Role } from 'aws-cdk-lib/aws-iam';
import { ParameterDataType, ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';

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
      pointInTimeRecovery: this.stage === 'PROD',
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

    table.addGlobalSecondaryIndex({
      indexName: 'campaignName-name-index',
      projectionType: ProjectionType.ALL,
      partitionKey: {
        name: 'campaignName',
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

  buildCampaignsTable(): Table {
    const id = `CampaignsDynamoTable`;

    const table = new Table(this, id, {
      tableName: `support-admin-console-campaigns-${this.stage}`,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: this.stage === 'PROD',
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'name',
        type: AttributeType.STRING,
      },
    });

    // Give it a better name
    const defaultChild = table.node.defaultChild as unknown as CfnElement;
    defaultChild.overrideLogicalId(id);

    return table;
  }

  buildArchivedTestsTable(): Table {
    const id = `ArchivedChannelTestsDynamoTable`;

    const table = new Table(this, id, {
      tableName: `support-admin-console-archived-channel-tests-${this.stage}`,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: this.stage === 'PROD',
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

  buildBannerDesignsTable(): Table {
    const id = `BannerDesignsDynamoTable`;

    const table = new Table(this, id, {
      tableName: `support-admin-console-banner-designs-${this.stage}`,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: this.stage === 'PROD',
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'name',
        type: AttributeType.STRING,
      },
    });

    // Give it a better name
    const defaultChild = table.node.defaultChild as unknown as CfnElement;
    defaultChild.overrideLogicalId(id);

    return table;
  }

  buildChannelTestsDynamoPolicies(table: Table): GuAllowPolicy[] {
    return [
      new GuDynamoDBReadPolicy(this, `DynamoRead-${table.node.id}`, {
        tableName: table.tableName,
      }),
      new GuDynamoDBReadPolicy(this, `DynamoRead-${table.node.id}/index/campaignName-name-index`, {
        tableName: `${table.tableName}/index/campaignName-name-index`,
      }),
      new GuDynamoDBWritePolicy(this, `DynamoWrite-${table.node.id}`, {
        tableName: table.tableName,
      }),
    ];
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
    const archivedTestsDynamoTable = this.buildArchivedTestsTable();
    const campaignsDynamoTable = this.buildCampaignsTable();
    const bannerDesignsDynamoTable = this.buildBannerDesignsTable();
    const channelTestsDynamoPolicies =
      this.buildChannelTestsDynamoPolicies(channelTestsDynamoTable);
    const campaignsDynamoPolicies = this.buildDynamoPolicies(campaignsDynamoTable);
    const archivedTestsDynamoPolicies = this.buildDynamoPolicies(archivedTestsDynamoTable);
    const bannerDesignsDynamoPolicies = this.buildDynamoPolicies(bannerDesignsDynamoTable);

    const userData = `#!/bin/bash -ev
    aws --region ${this.region} s3 cp s3://membership-dist/${this.stack}/${this.stage}/${app}/support-admin-console_1.0-SNAPSHOT_all.deb /tmp
    dpkg -i /tmp/support-admin-console_1.0-SNAPSHOT_all.deb
    /opt/cloudwatch-logs/configure-logs application ${this.stack} ${this.stage} ${app} /var/log/support-admin-console/application.log`;

    const policies: Policy[] = [
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
      ...channelTestsDynamoPolicies,
      ...campaignsDynamoPolicies,
      ...archivedTestsDynamoPolicies,
      ...bannerDesignsDynamoPolicies,
      new GuDynamoDBReadPolicy(this, `DynamoRead-super-mode`, {
        tableName: 'super-mode-PROD', // always PROD for super mode
      }),
      new GuDynamoDBReadPolicy(this, `DynamoRead-super-mode/index/end`, {
        tableName: `super-mode-PROD/index/end`,
      }),
      new GuAllowPolicy(this, 'AthenaOutputBucket', {
        actions: ['s3:*'],
        resources: [`arn:aws:s3:::gu-support-analytics/*`, `arn:aws:s3:::gu-support-analytics`],
      }),
      new GuAllowPolicy(this, 'AcquisitionsBucket', {
        actions: ['s3:*'],
        resources: [`arn:aws:s3:::acquisition-events/*`, `arn:aws:s3:::acquisition-events`],
      }),
    ];

    const ec2App = new GuEc2App(this, {
      applicationPort: 9000,
      app,
      access: { scope: AccessScope.PUBLIC },
      certificateProps: {
        domainName,
      },
      monitoringConfiguration:
        this.stage === 'PROD'
          ? {
              http5xxAlarm: {
                tolerated5xxPercentage: 0,
                numberOfMinutesAboveThresholdBeforeAlarm: 1,
                alarmName: `5XX error returned by ${app} ${this.stage}`,
              },
              unhealthyInstancesAlarm: true,
              snsTopicName: 'marketing-dev',
            }
          : { noMonitoring: true },
      userData,
      roleConfiguration: {
        additionalPolicies: policies,
      },
      scaling: { minimumInstances: 1, maximumInstances: 2 },
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      withoutImdsv2: true,
    });

    ec2App.autoScalingGroup.role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AmazonAthenaFullAccess'),
    );

    new GuCname(this, 'cname', {
      app,
      domainName,
      ttl: Duration.minutes(60),
      resourceRecord: ec2App.loadBalancer.loadBalancerDnsName,
    });

    // Cross-account role for CAPI access to Dynamodb
    const capiAccountId = new GuStringParameter(this, 'CapiAccountId', {
      description: 'ID of the CAPI aws account',
    });

    const dynamoPolicyForCapi = new GuDynamoDBReadPolicy(this, `DynamoRead-for-capi`, {
      tableName: channelTestsDynamoTable.tableName,
    });

    new Role(this, 'capi-role', {
      roleName: `support-admin-console-channel-tests-capi-role-${this.stage}`,
      assumedBy: new AccountPrincipal(capiAccountId.valueAsString),
      inlinePolicies: {
        dynamoPolicyForCapi: dynamoPolicyForCapi.document,
      },
    });

    // This parameter is used by our WAF configuration
    new StringParameter(this, 'AlbSsmParam', {
      parameterName: `/infosec/waf/services/${this.stage}/support-admin-console-alb-arn`,
      description: `The arn of the ALB for amiable-${this.stage}. N.B. this parameter is created via cdk`,
      simpleName: false,
      stringValue: ec2App.loadBalancer.loadBalancerArn,
      tier: ParameterTier.STANDARD,
      dataType: ParameterDataType.TEXT,
    });
  }
}
