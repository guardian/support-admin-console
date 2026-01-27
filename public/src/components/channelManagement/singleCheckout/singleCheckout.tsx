import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { ValidatedTestEditor } from '../validatedTestEditor';
import SingleCheckoutTestEditor from './singleCheckoutTestEditor';
import { getDefaultTest } from './utils/defaults';
import { SingleCheckoutTest } from '../../../models/singleCheckout';

const createDefaultSingleCheckoutTest = (
  newTestName: string,
  newTestNickname: string,
): SingleCheckoutTest => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
});

export const SingleCheckoutTestsForm = TestsForm(
  ValidatedTestEditor(SingleCheckoutTestEditor),
  FrontendSettingsType.singleCheckout,
  createDefaultSingleCheckoutTest,
);
