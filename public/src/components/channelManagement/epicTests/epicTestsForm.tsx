import React from 'react';
import EpicTestEditor from './epicTestEditor';
import { Region } from '../../../utils/models';

import { UserCohort, Cta, ArticlesViewedSettings, Test } from '../helpers/shared';
import { InnerComponentProps, updateTest } from '../testEditor';
import TestsForm from '../testEditor';
import TestsFormLayout from '../testsFormLayout';
import Sidebar from '../sidebar';
import { FrontendSettingsType } from '../../../utils/requests';
import { MaxEpicViewsDefaults } from './maxEpicViewsEditor';

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
export interface EpicVariant {
  name: string;
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
  userCohort?: UserCohort;
  isLiveBlog: boolean;
  hasCountryName: boolean;
  variants: EpicVariant[];
  highPriority: boolean; // has been removed from form, but might be used in future
  useLocalViewLog: boolean;
  articlesViewedSettings?: ArticlesViewedSettings;
}

const createDefaultEpicTest = (newTestName: string, newTestNickname: string): EpicTest => ({
  name: newTestName,
  nickname: newTestNickname,
  isOn: false,
  locations: [],
  tagIds: [],
  sections: [],
  excludedTagIds: [],
  excludedSections: [],
  alwaysAsk: false,
  maxViews: MaxEpicViewsDefaults,
  userCohort: UserCohort.AllNonSupporters, // matches the default in dotcom
  isLiveBlog: false,
  hasCountryName: false,
  variants: [],
  highPriority: false, // has been removed from form, but might be used in future
  useLocalViewLog: false,
});

type Props = InnerComponentProps<EpicTest>;

const EpicTestsForm: React.FC<Props> = ({
  tests,
  modifiedTests,
  selectedTestName,
  onTestsChange,
  onSelectedTestName,
  onTestDelete,
  onTestArchive,
  onTestErrorStatusChange,
  lockStatus,
  requestTakeControl,
  requestLock,
  save,
  cancel,
  editMode,
}: Props) => {
  const createTest = (name: string, nickname: string): void => {
    const newTests = [...tests, createDefaultEpicTest(name, nickname)];
    onTestsChange(newTests, name);
  };
  return (
    <TestsFormLayout
      sidebar={
        <Sidebar<EpicTest>
          tests={tests}
          modifiedTests={modifiedTests}
          selectedTestName={selectedTestName}
          onUpdate={onTestsChange}
          onSelectedTestName={onSelectedTestName}
          createTest={createTest}
          isInEditMode={editMode}
        />
      }
      testEditor={
        selectedTestName ? (
          <EpicTestEditor
            test={tests.find(test => test.name === selectedTestName)}
            hasChanged={!!modifiedTests[selectedTestName]}
            onChange={(updatedTest): void =>
              onTestsChange(updateTest(tests, updatedTest), updatedTest.name)
            }
            onValidationChange={onTestErrorStatusChange(selectedTestName)}
            visible
            editMode={editMode}
            onDelete={onTestDelete}
            onArchive={onTestArchive}
            onSelectedTestName={onSelectedTestName}
            isDeleted={modifiedTests[selectedTestName] && modifiedTests[selectedTestName].isDeleted}
            isArchived={
              modifiedTests[selectedTestName] && modifiedTests[selectedTestName].isArchived
            }
            isNew={modifiedTests[selectedTestName] && modifiedTests[selectedTestName].isNew}
            createTest={(newTest: EpicTest): void => {
              const newTests = [...tests, newTest];
              onTestsChange(newTests, newTest.name);
            }}
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
      save={save}
      cancel={cancel}
      editMode={editMode}
    />
  );
};

export const ArticleEpicTestsForm = TestsForm(EpicTestsForm, FrontendSettingsType.epicTests);
export const LiveblogEpicTestsForm = TestsForm(
  EpicTestsForm,
  FrontendSettingsType.liveblogEpicTests,
);
