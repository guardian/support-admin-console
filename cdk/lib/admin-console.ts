import { GuEc2App } from '@guardian/cdk';
import { AccessScope } from '@guardian/cdk/lib/constants';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack, GuStringParameter } from '@guardian/cdk/lib/constructs/core';
import { GuCname } from '@guardian/cdk/lib/constructs/dns';
import {
  GuAllowPolicy,
  GuDynamoDBReadPolicy,
  GuGetS3ObjectsPolicy,
  GuPutS3ObjectsPolicy,
} from '@guardian/cdk/lib/constructs/iam';
import type { App, CfnElement } from 'aws-cdk-lib';
import { Duration, RemovalPolicy, Tags } from 'aws-cdk-lib';
import { AttributeType, BillingMode, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { InstanceClass, InstanceSize, InstanceType, UserData } from 'aws-cdk-lib/aws-ec2';
import {
  ApplicationListenerRule,
  ListenerAction,
  ListenerCondition,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import type { Policy } from 'aws-cdk-lib/aws-iam';
import { AccountPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { ParameterDataType, ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';
import {MultiDynamoTableReadPolicy, MultiDynamoTableWritePolicy} from "./dynamo-managed-policy";

export interface AdminConsoleProps extends GuStackProps {
  domainName: string;
}

// Enable automated backups via https://github.com/guardian/aws-backup
const enableBackups = (table: Table) => {
  Tags.of(table).add('devx-backup-enabled', 'true');
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

    enableBackups(table);
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

    enableBackups(table);
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

    enableBackups(table);
    return table;
  }

  buildTestsAuditTable(): Table {
    const id = `ChannelTestsAuditDynamoTable`;

    const table = new Table(this, id, {
      tableName: `support-admin-console-channel-tests-audit-${this.stage}`,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: this.stage === 'PROD',
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        // {channel}_{testName}, e.g. "Epic_2025-01-01_MY_TEST"
        name: 'channelAndName',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: AttributeType.STRING,
      },
      timeToLiveAttribute: 'ttlInSecondsSinceEpoch',
    });

    // Give it a better name
    const defaultChild = table.node.defaultChild as unknown as CfnElement;
    defaultChild.overrideLogicalId(id);

    enableBackups(table);
    return table;
  }

  buildArchivedBannerDesignsTable(): Table {
    const id = `ArchivedBannerDesignsDynamoTable`;

    const table = new Table(this, id, {
      tableName: `support-admin-console-archived-banner-designs-${this.stage}`,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: this.stage === 'PROD',
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'name',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'date',
        type: AttributeType.STRING,
      },
    });

    // Give it a better name
    const defaultChild = table.node.defaultChild as unknown as CfnElement;
    defaultChild.overrideLogicalId(id);

    enableBackups(table);
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

    enableBackups(table);
    return table;
  }

  buildPermissionsTable(): Table {
    const id = `RRCPPermissionsDynamoTable`;

    const table = new Table(this, id, {
      tableName: `support-admin-console-permissions-${this.stage}`,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: this.stage === 'PROD',
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'email',
        type: AttributeType.STRING,
      },
    });

    // Give it a better name
    const defaultChild = table.node.defaultChild as unknown as CfnElement;
    defaultChild.overrideLogicalId(id);

    enableBackups(table);
    return table;
  }

  buildPromoCampaignsTable(): Table {
    const table = new Table(this, 'PromoCampaignsDynamoTable', {
      tableName: `support-admin-console-promo-campaigns-${this.stage}`,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: this.stage === 'PROD',
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'campaignCode',
        type: AttributeType.STRING,
      },
    });

    enableBackups(table);
    return table;
  }

  buildPromosTable(): Table {
    const table = new Table(this, 'PromosDynamoTable', {
      tableName: `support-admin-console-promos-${this.stage}`,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: this.stage === 'PROD',
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'promoCode',
        type: AttributeType.STRING,
      },
    });

    table.addGlobalSecondaryIndex({
      indexName: 'campaignCode-index',
      projectionType: ProjectionType.ALL,
      partitionKey: {
        name: 'campaignCode',
        type: AttributeType.STRING,
      },
    });

    enableBackups(table);
    return table;
  }

  constructor(scope: App, id: string, props: AdminConsoleProps) {
    super(scope, id, props);

    const { domainName } = props;

    const app = 'admin-console';

    const channelTestsDynamoTable = this.buildTestsTable();
    const archivedTestsDynamoTable = this.buildArchivedTestsTable();
    const channelTestsAuditDynamoTable = this.buildTestsAuditTable();
    const campaignsDynamoTable = this.buildCampaignsTable();
    const bannerDesignsDynamoTable = this.buildBannerDesignsTable();
    const archivedBannerDesignsDynamoTable = this.buildArchivedBannerDesignsTable();
    const permissionsTable = this.buildPermissionsTable();
    const promoCampaignsDynamoTable = this.buildPromoCampaignsTable();
    const promosTable = this.buildPromosTable();

    const dynamoReadPolicy = new MultiDynamoTableReadPolicy(this, `DynamoReadPolicy`, [
      channelTestsDynamoTable.tableName,
      campaignsDynamoTable.tableName,
      archivedTestsDynamoTable.tableName,
      channelTestsAuditDynamoTable.tableName,
      bannerDesignsDynamoTable.tableName,
      archivedBannerDesignsDynamoTable.tableName,
      permissionsTable.tableName,
      promoCampaignsDynamoTable.tableName,
      promosTable.tableName,
      'super-mode-calculator-PROD', // always PROD for super mode
      `support-bandit-${this.stage}`,
    ]);

    const dynamoWritePolicy = new MultiDynamoTableWritePolicy(this, `DynamoWritePolicy`, [
      channelTestsDynamoTable.tableName,
      campaignsDynamoTable.tableName,
      archivedTestsDynamoTable.tableName,
      channelTestsAuditDynamoTable.tableName,
      bannerDesignsDynamoTable.tableName,
      archivedBannerDesignsDynamoTable.tableName,
      permissionsTable.tableName,
      promoCampaignsDynamoTable.tableName,
      promosTable.tableName,
    ]);

    const userData = UserData.forLinux();
    userData.addCommands(
      `aws --region ${this.region} s3 cp s3://membership-dist/${this.stack}/${this.stage}/${app}/support-admin-console_1.0-SNAPSHOT_all.deb /tmp
      dpkg -i /tmp/support-admin-console_1.0-SNAPSHOT_all.deb
      /opt/cloudwatch-logs/configure-logs application ${this.stack} ${this.stage} ${app} /var/log/support-admin-console/application.log`
    )


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
          `arn:aws:s3:::gu-contributions-public/gutter/${this.stage}/*`,
          `arn:aws:s3:::gu-contributions-public/supportLandingPage/${this.stage}/*`,
        ],
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
              snsTopicName: 'alarms-handler-topic-PROD',
            }
          : { noMonitoring: true },
      userData,
      roleConfiguration: {
        additionalPolicies: policies,
      },
      scaling: { minimumInstances: 1, maximumInstances: 2 },
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
    });

    dynamoReadPolicy.attachToRole(ec2App.autoScalingGroup.role);
    dynamoWritePolicy.attachToRole(ec2App.autoScalingGroup.role);

    // Rule to only allow known http methods
    new ApplicationListenerRule(this, 'AllowKnownMethods', {
      listener: ec2App.listener,
      priority: 1,
      conditions: [ListenerCondition.httpRequestMethods(['GET', 'POST', 'PUT', 'DELETE', 'HEAD'])],
      targetGroups: [ec2App.targetGroup],
    });
    // Default rule to block requests which don't match the above rule
    new ApplicationListenerRule(this, 'BlockUnknownMethods', {
      listener: ec2App.listener,
      priority: 2,
      conditions: [ListenerCondition.pathPatterns(['*'])], // anything
      action: ListenerAction.fixedResponse(400, {
        contentType: 'application/json',
        messageBody: 'Unsupported http method',
      }),
    });

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
    const s3ReadPolicyForCapi = new GuGetS3ObjectsPolicy(this, 's3Get-for-capi', {
      bucketName: 'support-admin-console',
      paths: [`${this.stage}/*`, 'channel-switches.json'],
    });

    new Role(this, 'capi-role', {
      roleName: `support-admin-console-channel-tests-capi-role-${this.stage}`,
      assumedBy: new AccountPrincipal(capiAccountId.valueAsString),
      inlinePolicies: {
        dynamoPolicyForCapi: dynamoPolicyForCapi.document,
        s3ReadPolicyForCapi: s3ReadPolicyForCapi.document,
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
