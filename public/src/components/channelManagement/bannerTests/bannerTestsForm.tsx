import TestsForm, { InnerComponentProps } from '../testEditor';
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
    selectedTestName,
    selectedTestHasBeenModified,
    onTestChange,
    onTestPriorityChange,
    onSelectedTestName,
    onTestSave,
    onTestDelete,
    onTestArchive,
    onTestCreate,
    onTestErrorStatusChange,
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
        onTestCreate(createDefaultBannerTest(name, nickname));
      }
    };

    const selectedTest = tests.find(t => t.name === selectedTestName);

    return (
      <TestsFormLayout
        sidebar={
          <Sidebar<BannerTest>
            tests={tests}
            selectedTestName={selectedTestName}
            onTestPriorityChange={onTestPriorityChange}
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
              hasChanged={selectedTestHasBeenModified}
              onChange={onTestChange}
              onValidationChange={onTestErrorStatusChange}
              visible
              editMode={editMode}
              onDelete={onTestDelete}
              onArchive={onTestArchive}
              onSelectedTestName={onSelectedTestName}
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
