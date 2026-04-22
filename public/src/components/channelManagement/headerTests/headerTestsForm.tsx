import type { HeaderTest } from '../../../models/header';
import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { ValidatedTestEditor } from '../validatedTestEditor';
import HeaderTestEditor from './headerTestEditor';
import { getDefaultTest } from './utils/defaults';

const createDefaultHeaderTest = (newTestName: string, newTestNickname: string): HeaderTest => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
});

export const HeaderTestsForm = TestsForm(
  ValidatedTestEditor(HeaderTestEditor),
  FrontendSettingsType.HeaderTests,
  createDefaultHeaderTest,
);
