import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { ValidatedTestEditor } from '../validatedTestEditor';
import { CheckoutNudgeTest } from '../../../models/checkoutNudge';
import CheckoutNudgeTestEditor from './checkoutNudgeTestEditor';
import { getDefaultTest } from './utils/defaults';

const createDefaultCheckoutNudgeTest = (
  newTestName: string,
  newTestNickname: string,
): CheckoutNudgeTest => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
});

export const CheckoutNudgeTestsForm = TestsForm(
  ValidatedTestEditor(CheckoutNudgeTestEditor),
  FrontendSettingsType.checkoutNudgeTests,
  createDefaultCheckoutNudgeTest,
);
