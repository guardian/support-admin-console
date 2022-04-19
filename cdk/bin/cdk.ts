import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import type { AdminConsoleProps } from '../lib/admin-console';
import { AdminConsole } from '../lib/admin-console';
import { AdminConsoleDynamo } from '../lib/admin-console-dynamo';

const app = new App();

const codeProps: AdminConsoleProps = {
  stack: 'support',
  stage: 'CODE',
  domainName: 'support.code.dev-gutools.co.uk',
};
new AdminConsole(app, 'AdminConsole-CODE', codeProps);

export const prodProps: AdminConsoleProps = {
  stack: 'support',
  stage: 'PROD',
  domainName: 'support.gutools.co.uk',
};
new AdminConsole(app, 'AdminConsole-PROD', prodProps);

new AdminConsoleDynamo(app, 'AdminConsoleDynamo-CODE', { stack: 'support', stage: 'CODE' });
new AdminConsoleDynamo(app, 'AdminConsoleDynamo-PROD', { stack: 'support', stage: 'PROD' });
