import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { AdminConsole } from '../lib/admin-console';

const app = new App();
new AdminConsole(app, 'AdminConsole-CODE', { stack: 'support', stage: 'CODE' });
new AdminConsole(app, 'AdminConsole-PROD', { stack: 'support', stage: 'PROD' });
