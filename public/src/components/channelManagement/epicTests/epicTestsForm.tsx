import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { getDefaultTest, getDefaultVariant } from './utils/defaults';
import {
  AMP_EPIC_CONFIG,
  APPLE_NEWS_EPIC_CONFIG,
  ARTICLE_EPIC_CONFIG,
  ARTICLE_EPIC_HOLDBACK_CONFIG,
  EpicEditorConfig,
  LIVEBLOG_EPIC_CONFIG,
} from '../helpers/shared';
import { getEpicTestEditor } from './epicTestEditor';
import { EpicTest } from '../../../models/epic';

const createDefaultEpicTest = (epicEditorConfig: EpicEditorConfig) => (
  newTestName: string,
  newTestNickname: string,
): EpicTest => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
  variants: epicEditorConfig.allowMultipleVariants ? [] : [{ ...getDefaultVariant() }],
});

const buildEpicTestsForm = (
  epicEditorConfig: EpicEditorConfig,
  settingsType: FrontendSettingsType,
) =>
  TestsForm(
    getEpicTestEditor(epicEditorConfig),
    settingsType,
    createDefaultEpicTest(epicEditorConfig),
    epicEditorConfig.testNamePrefix,
  );

export const ArticleEpicTestsForm = buildEpicTestsForm(
  ARTICLE_EPIC_CONFIG,
  FrontendSettingsType.epicTests,
);

export const ArticleEpicHoldbackTestsForm = buildEpicTestsForm(
  ARTICLE_EPIC_HOLDBACK_CONFIG,
  FrontendSettingsType.epicHoldbackTests,
);

export const LiveblogEpicTestsForm = buildEpicTestsForm(
  LIVEBLOG_EPIC_CONFIG,
  FrontendSettingsType.liveblogEpicTests,
);
export const AppleNewsEpicTestsForm = buildEpicTestsForm(
  APPLE_NEWS_EPIC_CONFIG,
  FrontendSettingsType.appleNewsEpicTests,
);
export const AMPEpicTestsForm = buildEpicTestsForm(
  AMP_EPIC_CONFIG,
  FrontendSettingsType.ampEpicTests,
);
