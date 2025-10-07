import type { GuStack } from "@guardian/cdk/lib/constructs/core";
import { Effect, ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";

class MultiDynamoTablePolicy extends ManagedPolicy {
  constructor(scope: GuStack, id: string, tableNames: string[], actions: string[]) {
    super(scope, id, {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: actions.map((action) => `dynamodb:${action}`),
          resources: [
            ...tableNames.flatMap(tableName => [
              `arn:aws:dynamodb:${scope.region}:${scope.account}:table/${tableName}`,
              `arn:aws:dynamodb:${scope.region}:${scope.account}:table/${tableName}/index/*`,
            ])
          ]
        })
      ]
    });
  }
}

export class MultiDynamoTableReadPolicy extends MultiDynamoTablePolicy {
  constructor(scope: GuStack, id: string, tableNames: string[]) {
    super(scope, id, tableNames, ["BatchGetItem", "GetItem", "Scan", "Query", "GetRecords"]);
  }
}

export class MultiDynamoTableWritePolicy extends MultiDynamoTablePolicy {
  constructor(scope: GuStack, id: string, tableNames: string[]) {
    super(scope, id, tableNames, ["BatchWriteItem", "PutItem", "DeleteItem", "UpdateItem"]);
  }
}
