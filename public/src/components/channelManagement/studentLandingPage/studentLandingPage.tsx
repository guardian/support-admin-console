import { StudentLandingPageTest } from '../../../models/studentLandingPage';
import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { ValidatedTestEditor } from '../validatedTestEditor';
import { StudentLandingPageTestEditor } from './studentLandingPageTestEditor';
import { getDefaultTest, getDefaultVariant } from './utils/defaults';

const createDefaultStudentLandingPageTest = (
  newTestName: string,
  newTestNickname: string,
): StudentLandingPageTest => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
  variants: [getDefaultVariant()],
});

export const StudentLandingPageTestsForm = TestsForm(
  ValidatedTestEditor(StudentLandingPageTestEditor),
  FrontendSettingsType.studentLandingPageTests,
  createDefaultStudentLandingPageTest,
);
