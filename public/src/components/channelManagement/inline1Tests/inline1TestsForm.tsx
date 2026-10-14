import { Inline1Test } from '../../../models/inline1';
import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { ValidatedTestEditor } from '../validatedTestEditor';
import { getDefaultTest } from './defaults';
import Inline1TestEditor from './inline1TestEditor';

const createDefaultInline1Test = (newTestName: string, newTestNickName: string): Inline1Test => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickName,
});

export const Inline1TestsForm = TestsForm(
  ValidatedTestEditor(Inline1TestEditor),
  FrontendSettingsType.Inline1Tests,
  createDefaultInline1Test,
);
