import { Inline1Test } from '../../../models/inline1';
import { FrontendSettingsType } from '../../../utils/requests';
import { INLINE1_EDITOR_CONFIG, Inline1EditorConfig } from '../helpers/shared';
import { TestsForm } from '../testsForm';
import { getInline1TestEditor } from './inline1TestEditor';
import { getDefaultTest } from './utils/defaults';

const createDefaultInline1Test =
  (inline1EditorConfig: Inline1EditorConfig) =>
  (newTestName: string, newTestNickName: string): Inline1Test => ({
    ...getDefaultTest(),
    name: newTestName,
    nickname: newTestNickName,
    variants: inline1EditorConfig.allowMultipleVariants
      ? []
      : [{ ...getDefaultTest().variants[0] }],
  });

export const Inline1TestsForm = TestsForm(
  getInline1TestEditor(INLINE1_EDITOR_CONFIG),
  FrontendSettingsType.Inline1Tests,
  createDefaultInline1Test(INLINE1_EDITOR_CONFIG),
);
