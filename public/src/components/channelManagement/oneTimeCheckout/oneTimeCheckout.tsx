import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { ValidatedTestEditor } from '../validatedTestEditor';
import OneTimeCheckoutTestEditor from './oneTimeCheckoutTestEditor';
import { getDefaultTest } from './utils/defaults';
import { OneTimeCheckoutTest } from '../../../models/oneTimeCheckout';

const createDefaultOneTimeCheckoutTest = (
  newTestName: string,
  newTestNickname: string,
): OneTimeCheckoutTest => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
});

export const OneTimeCheckoutTestsForm = TestsForm(
  ValidatedTestEditor(OneTimeCheckoutTestEditor),
  FrontendSettingsType.oneTimeCheckout,
  createDefaultOneTimeCheckoutTest,
);
