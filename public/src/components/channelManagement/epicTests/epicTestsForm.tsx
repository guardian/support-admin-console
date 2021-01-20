import React from 'react';
import EpicTestEditor from './epicTestEditor';
import { Region } from '../../../utils/models';

import {
  UserCohort,
  Cta,
  ArticlesViewedSettings,
  Test,
  Variant,
  EpicType,
} from '../helpers/shared';
import { InnerComponentProps } from '../testEditor';
import TestsForm from '../testEditor';
import TestsFormLayout from '../testsFormLayout';
import Sidebar from '../sidebar';
import { FrontendSettingsType } from '../../../utils/requests';
import { getDefaultTest, getDefaultVariant } from './utils/defaults';

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
export interface EpicVariant extends Variant {
  heading?: string;
  paragraphs: string[];
  highlightedText?: string;
  footer?: string;
  showTicker: boolean;
  tickerSettings?: TickerSettings;
  backgroundImageUrl?: string;
  cta?: Cta;
  secondaryCta?: Cta;
}

export interface MaxEpicViews {
  maxViewsCount: number;
  maxViewsDays: number;
  minDaysBetweenViews: number;
}

export interface ControlProportionSettings {
  proportion: number;
  offset: number;
}

export interface EpicTest extends Test {
  name: string;
  nickname?: string;
  isOn: boolean;
  locations: Region[];
  tagIds: string[];
  sections: string[];
  excludedTagIds: string[];
  excludedSections: string[];
  alwaysAsk: boolean;
  maxViews?: MaxEpicViews;
  userCohort: UserCohort;
  isLiveBlog: boolean;
  hasCountryName: boolean;
  variants: EpicVariant[];
  highPriority: boolean; // has been removed from form, but might be used in future
  useLocalViewLog: boolean;
  articlesViewedSettings?: ArticlesViewedSettings;
  controlProportionSettings?: ControlProportionSettings;
}

type Props = InnerComponentProps<EpicTest>;

const getEpicTestForm = (epicType: EpicType): React.FC<Props> => {
  const isLiveBlog = epicType === 'LIVEBLOG';
  const isOffPlatform = epicType === 'APPLE_NEWS' || epicType === 'AMP';

  const createDefaultEpicTest = (newTestName: string, newTestNickname: string): EpicTest => ({
    ...getDefaultTest(),
    name: newTestName,
    nickname: newTestNickname,
    isLiveBlog: isLiveBlog,
    variants: isOffPlatform ? [{ ...getDefaultVariant() }] : [],
  });

  const EpicTestsForm: React.FC<Props> = ({
    tests,
    selectedTestName,
    selectedTestHasBeenModified,
    onTestSelected,
    onTestSave,
    onTestDelete,
    onTestArchive,
    onTestErrorStatusChange,
    onTestChange,
    onTestCreate,
    onTestPriorityChange,
    lockStatus,
    requestTakeControl,
    requestLock,
    cancel,
    editMode,
  }: Props) => {
    const createTest = (name: string, nickname: string): void => {
      if (selectedTestHasBeenModified) {
        alert('Please either save or discard before creating a test.');
      } else {
        onTestCreate(createDefaultEpicTest(name, nickname));
      }
    };

    const selectedTest = tests.find(t => t.name === selectedTestName);

    return (
      <TestsFormLayout
        sidebar={
          <Sidebar<EpicTest>
            tests={tests}
            selectedTestName={selectedTestName}
            onTestPriorityChange={onTestPriorityChange}
            onTestSelected={onTestSelected}
            createTest={createTest}
            isInEditMode={editMode}
          />
        }
        testEditor={
          selectedTestName && selectedTest ? (
            <EpicTestEditor
              test={selectedTest}
              hasChanged={selectedTestHasBeenModified}
              epicType={epicType}
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

  return EpicTestsForm;
};

export const ArticleEpicTestsForm = TestsForm(
  getEpicTestForm('ARTICLE'),
  FrontendSettingsType.epicTests,
);

export const ArticleEpicHoldbackTestsForm = TestsForm(
  getEpicTestForm('ARTICLE_HOLDBACK'),
  FrontendSettingsType.epicHoldbackTests,
);

export const LiveblogEpicTestsForm = TestsForm(
  getEpicTestForm('LIVEBLOG'),
  FrontendSettingsType.liveblogEpicTests,
);
export const AppleNewsEpicTestsForm = TestsForm(
  getEpicTestForm('APPLE_NEWS'),
  FrontendSettingsType.appleNewsEpicTests,
);
export const AMPEpicTestsForm = TestsForm(
  getEpicTestForm('AMP'),
  FrontendSettingsType.ampEpicTests,
);
