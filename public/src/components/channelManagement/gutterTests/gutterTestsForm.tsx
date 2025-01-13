import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { getDefaultTest } from './utils/defaults';

const createDefaultGutterAskTest = (newTestName: string, newTestNickName: string) => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickName,
});

export const GutterTestsForm = TestsForm(
  ValidatedTestEditor(GutterTestEditor),
  FrontendSettingsType.gutterTests,
  createDefaultGutterAskTest,
);
