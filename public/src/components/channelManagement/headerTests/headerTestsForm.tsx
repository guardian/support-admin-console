import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { HeaderTest } from '../../../models/header';
import { getDefaultTest } from './utils/defaults';
import HeaderTestEditor from './headerTestEditor';
import { ValidatedTestEditor } from '../validatedTestEditor';

const createDefaultHeaderTest = (newTestName: string, newTestNickname: string): HeaderTest => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
});

export const HeaderTestsForm = TestsForm(
  ValidatedTestEditor(HeaderTestEditor),
  FrontendSettingsType.headerTests,
  createDefaultHeaderTest,
);
