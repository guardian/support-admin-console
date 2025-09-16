import type {GuStack} from "@guardian/cdk/lib/constructs/core";
import {GuAllowPolicy} from "@guardian/cdk/lib/constructs/iam";
import type {Table} from "aws-cdk-lib/aws-dynamodb";

const readActions = ["BatchGetItem", "GetItem", "Scan", "Query", "GetRecords"];
const writeActions = ["BatchWriteItem", "PutItem", "DeleteItem", "UpdateItem"];

export class DynamoPolicy extends GuAllowPolicy {
  constructor(scope: GuStack, id: string, tables: Table[]) {
    super(scope, id, {
      actions: [...readActions, ...writeActions].map((action) => `dynamodb:${action}`),
      resources: [
        ...tables.flatMap(table => [
          `arn:aws:dynamodb:${scope.region}:${scope.account}:table/${table.tableName}`,
          `arn:aws:dynamodb:${scope.region}:${scope.account}:table/${table.tableName}/index/*`,
        ])
      ]
    });
  }
}
