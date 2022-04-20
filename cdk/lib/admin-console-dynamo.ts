import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import type { App, CfnElement } from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export class AdminConsoleDynamo extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    const buildTable = (channel: string) => {
      const id = `${channel[0].toUpperCase() + channel.slice(1)}TestsDynamoTable`;

      const table = new Table(this, id, {
        tableName: `${channel}-tests-${this.stage}`,
        removalPolicy: RemovalPolicy.RETAIN,
        readCapacity: 4,
        writeCapacity: 4,
        partitionKey: {
          name: 'name',
          type: AttributeType.STRING,
        },
      });
      const defaultChild = table.node.defaultChild as unknown as CfnElement;
      defaultChild.overrideLogicalId(id);
    };

    buildTable('header');
    buildTable('epic');
    buildTable('banner');
  }
}
