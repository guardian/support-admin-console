import TestsForm, { InnerComponentProps } from '../testEditor';
import React from 'react';
import { FrontendSettingsType } from '../../../utils/requests';
import Sidebar from '../sidebar';
import BannerTestEditor from './bannerTestEditor';
import TestsFormLayout from '../testsFormLayout';
import { BannerTest } from '../../../models/banner';
import { getDefaultTest } from './utils/defaults';

type Props = InnerComponentProps<BannerTest>;

const getBannerTestsForm = (isFirstChannel: boolean): React.FC<Props> => {
  const createDefaultBannerTest = (newTestName: string, newTestNickname: string): BannerTest => ({
    ...getDefaultTest(),
    name: newTestName,
    nickname: newTestNickname,
    minArticlesBeforeShowingBanner: isFirstChannel ? 2 : 4,
  });

  const BannerTestsForm: React.FC<Props> = ({
    tests,
    selectedTestName,
    selectedTestHasBeenModified,
    onTestChange,
    onTestPriorityChange,
    onTestSelected,
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
    regionFilter,
    setRegionFilter,
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
            onTestSelected={onTestSelected}
            createTest={createTest}
            isInEditMode={editMode}
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
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
