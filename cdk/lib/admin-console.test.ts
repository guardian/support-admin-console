import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AdminConsole } from './admin-console';

describe('The AdminConsole stack', () => {
  it('matches the snapshot', () => {
    const app = new App();
    const stack = new AdminConsole(app, 'AdminConsole', {
      stack: 'support',
      stage: 'TEST',
      domainName: 'support.code.dev-gutools.co.uk',
    });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
