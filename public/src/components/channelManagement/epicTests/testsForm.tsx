import { EpicTest } from '../../../models/epic';
import { FrontendSettingsType } from '../../../utils/requests';
import {
  APPLE_NEWS_EPIC_CONFIG,
  ARTICLE_EPIC_CONFIG,
  EpicEditorConfig,
  LIVEBLOG_EPIC_CONFIG,
} from '../helpers/shared';
import { TestsForm } from '../testsForm';
import { getEpicTestEditor } from './testEditor';
import { getDefaultTest, getDefaultVariant } from './utils/defaults';

const createDefaultEpicTest =
  (epicEditorConfig: EpicEditorConfig) =>
  (newTestName: string, newTestNickname: string): EpicTest => ({
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
  FrontendSettingsType.EpicTests,
);
export const LiveblogEpicTestsForm = buildEpicTestsForm(
  LIVEBLOG_EPIC_CONFIG,
  FrontendSettingsType.LiveblogEpicTests,
);
export const AppleNewsEpicTestsForm = buildEpicTestsForm(
  APPLE_NEWS_EPIC_CONFIG,
  FrontendSettingsType.AppleNewsEpicTests,
);
