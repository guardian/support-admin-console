import type { SupportLandingPageTest } from '../../../models/supportLandingPage';
import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { ValidatedTestEditor } from '../validatedTestEditor';
import SupportLandingPageTestEditor from './supportLandingPageTestEditor';
import { getDefaultTest } from './utils/defaults';

const createDefaultSupportLandingPageTest = (
  newTestName: string,
  newTestNickname: string,
): SupportLandingPageTest => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
});

export const SupportLandingPageTestsForm = TestsForm(
  ValidatedTestEditor(SupportLandingPageTestEditor),
  FrontendSettingsType.SupportLandingPageTests,
  createDefaultSupportLandingPageTest,
);
