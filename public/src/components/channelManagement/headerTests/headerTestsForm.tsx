import React from 'react';
import HeaderTestEditor from './headerTestEditor';
import { Region } from '../../../utils/models';

import {
  UserCohort,
  Cta,
  ArticlesViewedSettings,
  Test,
  Variant,
  HeaderEditorConfig,
  HEADER_CONFIG,
  // ARTICLE_HEADER_HOLDBACK_CONFIG,
  // LIVEBLOG_HEADER_CONFIG,
  // APPLE_NEWS_HEADER_CONFIG,
  // AMP_HEADER_CONFIG,
  SecondaryCta,
} from '../helpers/shared';
import { InnerComponentProps } from '../testEditor';
import TestsForm from '../testEditor';
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

export interface HeaderVariant extends Variant {
  heading?: string;
  paragraphs: string[];
  highlightedText?: string;
  footer?: string;
  showTicker: boolean;
  tickerSettings?: TickerSettings;
  backgroundImageUrl?: string;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
  separateArticleCount?: SeparateArticleCount;
  showChoiceCards?: boolean;
  showSignInLink?: boolean;
}

export interface MaxHeaderViews {
  maxViewsCount: number;
  maxViewsDays: number;
  minDaysBetweenViews: number;
}

export interface HeaderTest extends Test {
  name: string;
  nickname?: string;
  isOn: boolean;
  locations: Region[];
  tagIds: string[];
  sections: string[];
  excludedTagIds: string[];
  excludedSections: string[];
  alwaysAsk: boolean;
  maxViews?: MaxHeaderViews;
  userCohort: UserCohort;
  hasCountryName: boolean;
  variants: HeaderVariant[];
  highPriority: boolean; // has been removed from form, but might be used in future
  useLocalViewLog: boolean;
  articlesViewedSettings?: ArticlesViewedSettings;
  controlProportionSettings?: ControlProportionSettings;
}

type Props = InnerComponentProps<HeaderTest>;

const getHeaderTestForm = (headerEditorConfig: HeaderEditorConfig): React.FC<Props> => {
  const createDefaultHeaderTest = (newTestName: string, newTestNickname: string): HeaderTest => ({
    ...getDefaultTest(),
    name: newTestName,
    nickname: newTestNickname,
    variants: headerEditorConfig.allowMultipleVariants ? [] : [{ ...getDefaultVariant() }],
  });

  const HeaderTestsForm: React.FC<Props> = ({
    tests,
    selectedTestName,
    selectedTestHasBeenModified,
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
  }: Props) => {
    const createTest = (name: string, nickname: string): void => {
      if (selectedTestHasBeenModified) {
        alert('Please either save or discard before creating a test.');
      } else {
        onTestCreate(createDefaultHeaderTest(name, nickname));
      }
    };

    const selectedTest = tests.find(t => t.name === selectedTestName);

    return (
      <TestsFormLayout
        sidebar={
          <Sidebar<HeaderTest>
            tests={tests}
            selectedTestName={selectedTestName}
            onTestPriorityChange={onTestPriorityChange}
            onTestSelected={onTestSelected}
            testNamePrefix={headerEditorConfig.testNamePrefix}
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
            <HeaderTestEditor
              test={selectedTest}
              hasChanged={selectedTestHasBeenModified}
              headerEditorConfig={headerEditorConfig}
              onChange={onTestChange}
              onValidationChange={onTestErrorStatusChange}
              visible
              editMode={editMode}
              onDelete={onTestDelete}
              onArchive={onTestArchive}
              onTestSelected={onTestSelected}
              createTest={onTestCreate}
              testNames={tests.map(test => test.name)}
              testNicknames={
                tests.map(test => test.nickname).filter(nickname => !!nickname) as string[]
              }
              testNamePrefix={headerEditorConfig.testNamePrefix}
            />
          ) : null
        }
        selectedTestName={selectedTestName}
        lockStatus={lockStatus}
        requestTakeControl={requestTakeControl}
        requestLock={requestLock}
        save={onTestSave}
        cancel={cancel}
        editMode={editMode}
      />
    );
  };

  return HeaderTestsForm;
};

export const HeaderTestsForm = TestsForm(
  getHeaderTestForm(HEADER_CONFIG),
  FrontendSettingsType.headerTests,
);

// export const ArticleHeaderHoldbackTestsForm = TestsForm(
//   getHeaderTestForm(ARTICLE_HEADER_HOLDBACK_CONFIG),
//   FrontendSettingsType.headerHoldbackTests,
// );

// export const LiveblogHeaderTestsForm = TestsForm(
//   getHeaderTestForm(LIVEBLOG_HEADER_CONFIG),
//   FrontendSettingsType.liveblogHeaderTests,
// );
// export const AppleNewsHeaderTestsForm = TestsForm(
//   getHeaderTestForm(APPLE_NEWS_HEADER_CONFIG),
//   FrontendSettingsType.appleNewsHeaderTests,
// );
// export const AMPHeaderTestsForm = TestsForm(
//   getHeaderTestForm(AMP_HEADER_CONFIG),
//   FrontendSettingsType.ampHeaderTests,
// );
