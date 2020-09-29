import TestsForm, { InnerComponentProps, updateTest } from '../testEditor';
import React from 'react';
import { FrontendSettingsType } from '../../../utils/requests';
import Sidebar from '../sidebar';
import BannerTestEditor from './bannerTestEditor';
import TestsFormLayout from '../testsFormLayout';
import { UserCohort } from '../helpers/shared';
import { BannerTest } from '../../../models/banner';

type Props = InnerComponentProps<BannerTest>;

const getBannerTestsForm = (isFirstChannel: boolean): React.FC<Props> => {
  const createDefaultBannerTest = (newTestName: string, newTestNickname: string): BannerTest => ({
    name: newTestName,
    nickname: newTestNickname,
    isOn: false,
    minArticlesBeforeShowingBanner: isFirstChannel ? 2 : 4,
    userCohort: UserCohort.AllNonSupporters,
    locations: [],
    variants: [],
    articlesViewedSettings: undefined,
  });

  const BannerTestsForm: React.FC<Props> = ({
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
        const newTests = [...tests, createDefaultBannerTest(name, nickname)];
        onSelectedTestName(name);
        onTestsChange(newTests, name);
      }
    };

    const selectedTest = tests.find(t => t.name === selectedTestName);

    return (
      <TestsFormLayout
        sidebar={
          <Sidebar<BannerTest>
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
          // needed to convince typescript neither are undefined
          selectedTestName && selectedTest ? (
            <BannerTestEditor
              test={selectedTest}
              hasChanged={!!modifiedTests[selectedTestName]}
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
              createTest={(newTest: BannerTest): void => {
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
  return BannerTestsForm;
};

export const BannerTestsForm1 = TestsForm(
  getBannerTestsForm(true),
  FrontendSettingsType.bannerTests,
);
export const BannerTestsForm2 = TestsForm(
  getBannerTestsForm(false),
  FrontendSettingsType.bannerTests2,
);
