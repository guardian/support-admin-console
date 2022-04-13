import '@aws-cdk/assert/jest';
import { SynthUtils } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { AdminConsole } from './admin-console';

describe('The AdminConsole stack', () => {
  it('matches the snapshot', () => {
    const app = new App();
    const stack = new AdminConsole(app, 'AdminConsole', { stack: 'support', stage: 'TEST' });
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
