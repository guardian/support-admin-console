import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { prodProps } from '../bin/cdk';
import { AdminConsole } from './admin-console';

describe('The AdminConsole stack', () => {
  it('matches the snapshot', () => {
    const app = new App();
    const stack = new AdminConsole(app, 'AdminConsole', prodProps);
    const template = Template.fromStack(stack);
    const templateJson = template.toJSON() as {
      Resources: Record<string, { Properties?: { Tags?: unknown } }>;
    };
    Object.keys(templateJson.Resources)
      .filter(
        (resourceId) =>
          resourceId.startsWith('AllowKnownMethods') || resourceId.startsWith('BlockUnknownMethods'),
      )
      .forEach((resourceId) => {
        delete templateJson.Resources[resourceId].Properties?.Tags;
      });
    expect(templateJson).toMatchSnapshot();
  });
});
