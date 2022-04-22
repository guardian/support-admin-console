import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AdminConsole } from '../lib/admin-console';

const app = new App();
new AdminConsole(app, 'AdminConsole-CODE', {
  stack: 'support',
  stage: 'CODE',
  domainName: 'support.code.dev-gutools.co.uk',
});
new AdminConsole(app, 'AdminConsole-PROD', {
  stack: 'support',
  stage: 'PROD',
  domainName: 'support.gutools.co.uk',
});
