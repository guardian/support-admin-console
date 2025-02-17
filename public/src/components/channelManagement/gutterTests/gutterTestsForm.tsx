import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../sharedTestComponents/testsForm';
import GutterTestEditor from './gutterTestEditor';
import { getDefaultTest } from './utils/defaults';
import { ValidatedTestEditor } from '../sharedTestComponents/validatedTestEditor';

const createDefaultGutterAskTest = (newTestName: string, newTestNickName: string) => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickName,
});

export const GutterTestsForm = TestsForm(
  ValidatedTestEditor(GutterTestEditor),
  FrontendSettingsType.gutterLiveblogTests,
  createDefaultGutterAskTest,
);
