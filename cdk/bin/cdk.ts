import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import type { AdminConsoleProps } from '../lib/admin-console';
import { AdminConsole } from '../lib/admin-console';

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
