import React from 'react';
import EpicTestEditor from './epicTestEditor';
import { Region } from '../../../utils/models';

import {
  AMP_EPIC_CONFIG,
  APPLE_NEWS_EPIC_CONFIG,
  ARTICLE_EPIC_CONFIG,
  ARTICLE_EPIC_HOLDBACK_CONFIG,
  ArticlesViewedSettings,
  ContributionFrequency,
  Cta,
  DeviceType,
  EpicEditorConfig,
  Image,
  LIVEBLOG_EPIC_CONFIG,
  SecondaryCta,
  Status,
  Test,
  UserCohort,
  Variant,
} from '../helpers/shared';
import TestsForm, { InnerComponentProps } from '../testEditor';
import TestsFormLayout from '../testsFormLayout';
import Sidebar from '../sidebar';
import { FrontendSettingsType } from '../../../utils/requests';
import { getDefaultTest, getDefaultVariant } from './utils/defaults';
import { ControlProportionSettings } from '../helpers/controlProportionSettings';

export enum TickerEndType {
  unlimited = 'unlimited',
  hardstop = 'hardstop',
}
export enum TickerCountType {
  money = 'money',
  people = 'people',
}
interface TickerCopy {
  countLabel: string;
  goalReachedPrimary: string;
  goalReachedSecondary: string;
}
export interface TickerSettings {
  endType: TickerEndType;
  countType: TickerCountType;
  currencySymbol: string;
  copy: TickerCopy;
}

export interface SeparateArticleCount {
  type: 'above';
}

export interface EpicVariant extends Variant {
  heading?: string;
  paragraphs: string[];
  highlightedText?: string;
  footer?: string;
  showTicker: boolean;
  tickerSettings?: TickerSettings;
  image?: Image;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
  separateArticleCount?: SeparateArticleCount;
  showChoiceCards?: boolean;
  defaultChoiceCardFrequency?: ContributionFrequency;
  showSignInLink?: boolean;
}

export interface MaxEpicViews {
  maxViewsCount: number;
  maxViewsDays: number;
  minDaysBetweenViews: number;
}

export interface EpicTest extends Test {
  name: string;
  nickname?: string;
  isOn: boolean;
  status: Status;
  locations: Region[];
  tagIds: string[];
  sections: string[];
  excludedTagIds: string[];
  excludedSections: string[];
  alwaysAsk: boolean;
  maxViews?: MaxEpicViews;
  userCohort: UserCohort;
  hasCountryName: boolean;
  variants: EpicVariant[];
  highPriority: boolean; // has been removed from form, but might be used in future
  useLocalViewLog: boolean;
  articlesViewedSettings?: ArticlesViewedSettings;
  controlProportionSettings?: ControlProportionSettings;
  deviceType?: DeviceType;
}

type Props = InnerComponentProps<EpicTest>;

const getEpicTestForm = (epicEditorConfig: EpicEditorConfig): React.FC<Props> => {
  const createDefaultEpicTest = (newTestName: string, newTestNickname: string): EpicTest => ({
    ...getDefaultTest(),
    name: newTestName,
    nickname: newTestNickname,
    variants: epicEditorConfig.allowMultipleVariants ? [] : [{ ...getDefaultVariant() }],
  });

  const EpicTestsForm: React.FC<Props> = ({
    tests,
    selectedTestName,
    editedTestName,
    onTestSelected,
    onTestSave,
    onTestDelete,
    onTestArchive,
    onBatchTestDelete,
    onBatchTestArchive,
    onTestErrorStatusChange,
    onTestChange,
    onTestCreate,
    onTestPriorityChange,
    lockStatus,
    requestTakeControl,
    requestLock,
    cancel,
    editMode,
    regionFilter,
    setRegionFilter,
    saving,
  }: Props) => {
    const createTest = (name: string, nickname: string): void => {
      onTestCreate(createDefaultEpicTest(name, nickname));
    };

    const selectedTest = tests.find(t => t.name === selectedTestName);
    const selectedTestIsBeingEdited = selectedTestName === editedTestName;

    return (
      <TestsFormLayout
        sidebar={
          <Sidebar<EpicTest>
            tests={tests}
            selectedTestName={selectedTestName}
            editedTestName={editedTestName}
            onTestPriorityChange={onTestPriorityChange}
            onTestSelected={onTestSelected}
            testNamePrefix={epicEditorConfig.testNamePrefix}
            createTest={createTest}
            isInEditMode={editMode}
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
            onBatchTestDelete={onBatchTestDelete}
            onBatchTestArchive={onBatchTestArchive}
          />
        }
        testEditor={
          selectedTestName && selectedTest ? (
            <EpicTestEditor
              test={selectedTest}
              epicEditorConfig={epicEditorConfig}
              onChange={onTestChange}
              onValidationChange={onTestErrorStatusChange}
              visible
              editMode={editMode && selectedTestIsBeingEdited}
              onDelete={onTestDelete}
              onArchive={onTestArchive}
              onTestSelected={onTestSelected}
              createTest={onTestCreate}
              testNames={tests.map(test => test.name)}
              testNicknames={
                tests.map(test => test.nickname).filter(nickname => !!nickname) as string[]
              }
              testNamePrefix={epicEditorConfig.testNamePrefix}
            />
          ) : null
        }
        selectedTestName={selectedTestName}
        editedTestName={editedTestName}
        lockStatus={lockStatus}
        requestTakeControl={requestTakeControl}
        requestLock={requestLock}
        save={onTestSave}
        cancel={cancel}
        editMode={editMode}
        saving={saving}
      />
    );
  };

  return EpicTestsForm;
};

export const ArticleEpicTestsForm = TestsForm(
  getEpicTestForm(ARTICLE_EPIC_CONFIG),
  FrontendSettingsType.epicTests,
);

export const ArticleEpicHoldbackTestsForm = TestsForm(
  getEpicTestForm(ARTICLE_EPIC_HOLDBACK_CONFIG),
  FrontendSettingsType.epicHoldbackTests,
);

export const LiveblogEpicTestsForm = TestsForm(
  getEpicTestForm(LIVEBLOG_EPIC_CONFIG),
  FrontendSettingsType.liveblogEpicTests,
);
export const AppleNewsEpicTestsForm = TestsForm(
  getEpicTestForm(APPLE_NEWS_EPIC_CONFIG),
  FrontendSettingsType.appleNewsEpicTests,
);
export const AMPEpicTestsForm = TestsForm(
  getEpicTestForm(AMP_EPIC_CONFIG),
  FrontendSettingsType.ampEpicTests,
);
