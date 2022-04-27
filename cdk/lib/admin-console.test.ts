import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { prodProps } from '../bin/cdk';
import { AdminConsole } from './admin-console';

describe('The AdminConsole stack', () => {
  it('matches the snapshot', () => {
    const app = new App();
    const stack = new AdminConsole(app, 'AdminConsole', prodProps);
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
