import type {GuStack} from "@guardian/cdk/lib/constructs/core";
import {GuAllowPolicy} from "@guardian/cdk/lib/constructs/iam";

class MultiDynamoTablePolicy extends GuAllowPolicy {
  constructor(scope: GuStack, id: string, tableNames: string[], actions: string[]) {
    super(scope, id, {
      actions: actions.map((action) => `dynamodb:${action}`),
      resources: [
        ...tableNames.flatMap(tableName => [
          `arn:aws:dynamodb:${scope.region}:${scope.account}:table/${tableName}`,
          `arn:aws:dynamodb:${scope.region}:${scope.account}:table/${tableName}/index/*`,
        ])
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
