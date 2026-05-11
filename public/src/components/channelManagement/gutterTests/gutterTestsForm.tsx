import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { ValidatedTestEditor } from '../validatedTestEditor';
import GutterTestEditor from './gutterTestEditor';
import { getDefaultTest } from './utils/defaults';

const createDefaultGutterAskTest = (newTestName: string, newTestNickName: string) => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickName,
});

export const GutterTestsForm = TestsForm(
  ValidatedTestEditor(GutterTestEditor),
  FrontendSettingsType.GutterLiveblogTests,
  createDefaultGutterAskTest,
);
