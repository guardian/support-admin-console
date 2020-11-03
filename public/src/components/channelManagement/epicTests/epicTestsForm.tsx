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
  defaultCta,
} from '../helpers/shared';
import { InnerComponentProps, updateTest } from '../testEditor';
import TestsForm from '../testEditor';
import TestsFormLayout from '../testsFormLayout';
import Sidebar from '../sidebar';
import { FrontendSettingsType } from '../../../utils/requests';
import { DEFAULT_MAX_EPIC_VIEWS } from './epicTestMaxViewsEditor';

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
}

type Props = InnerComponentProps<EpicTest>;

const getEpicTestForm = (epicType: EpicType): React.FC<Props> => {
  const isLiveBlog = epicType === 'LIVEBLOG';
  const isAppleNews = epicType == 'APPLE_NEWS';

  const createDefaultEpicVariant = (): EpicVariant => ({
    name: 'CONTROL',
    heading: undefined,
    paragraphs: [],
    highlightedText:
      'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1 – and it only takes a minute. Thank you.',
    footer: undefined,
    showTicker: false,
    backgroundImageUrl: undefined,
    cta: defaultCta,
  });

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
    maxViews: DEFAULT_MAX_EPIC_VIEWS,
    userCohort: UserCohort.AllNonSupporters, // matches the default in dotcom
    isLiveBlog: isLiveBlog,
    hasCountryName: false,
    variants: isAppleNews ? [createDefaultEpicVariant()] : [],
    highPriority: false, // has been removed from form, but might be used in future
    useLocalViewLog: false,
  });

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
      if (Object.keys(modifiedTests).length > 0) {
        alert('Please either save or discard before creating a test.');
      } else {
        const newTests = [...tests, createDefaultEpicTest(name, nickname)];
        onSelectedTestName(name);
        onTestsChange(newTests, name);
      }
    };

    const selectedTest = tests.find(t => t.name === selectedTestName);

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
          selectedTestName && selectedTest ? (
            <EpicTestEditor
              test={selectedTest}
              hasChanged={!!modifiedTests[selectedTestName]}
              isLiveblog={isLiveBlog}
              epicType={epicType}
              onChange={(updatedTest): void =>
                onTestsChange(updateTest(tests, updatedTest), updatedTest.name)
              }
              onValidationChange={onTestErrorStatusChange(selectedTestName)}
              visible
              editMode={editMode}
              onDelete={(): void => onTestDelete(selectedTestName)}
              onArchive={(): void => onTestArchive(selectedTestName)}
              onSelectedTestName={onSelectedTestName}
              isDeleted={
                modifiedTests[selectedTestName] && modifiedTests[selectedTestName].isDeleted
              }
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

  return EpicTestsForm;
};

export const ArticleEpicTestsForm = TestsForm(
  getEpicTestForm('ARTICLE'),
  FrontendSettingsType.epicTests,
);
export const LiveblogEpicTestsForm = TestsForm(
  getEpicTestForm('LIVEBLOG'),
  FrontendSettingsType.liveblogEpicTests,
);
export const AppleNewsEpicTestsForm = TestsForm(
  getEpicTestForm('APPLE_NEWS'),
  FrontendSettingsType.appleNewsEpicTests,
);
