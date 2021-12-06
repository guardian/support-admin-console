import TestsForm, { InnerComponentProps } from '../testEditor';
import React from 'react';
import { FrontendSettingsType } from '../../../utils/requests';
import Sidebar from '../sidebar';
import HeadTestEditor from './headTestEditor';
import TestsFormLayout from '../testsFormLayout';
import { HeadTest } from '../../../models/head';
import { getDefaultTest } from './utils/defaults';

type Props = InnerComponentProps<HeadTest>;

const getHeadTestsForm = (isFirstChannel: boolean): React.FC<Props> => {
  const createDefaultHeadTest = (newTestName: string, newTestNickname: string): HeadTest => ({
    ...getDefaultTest(),
    name: newTestName,
    nickname: newTestNickname,
    minArticlesBeforeShowingHead: isFirstChannel ? 2 : 4,
  });

  const HeadTestsForm: React.FC<Props> = ({
    tests,
    selectedTestName,
    selectedTestHasBeenModified,
    onTestChange,
    onTestPriorityChange,
    onTestSelected,
    onTestSave,
    onTestDelete,
    onTestArchive,
    onBatchTestDelete,
    onBatchTestArchive,
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
        onTestCreate(createDefaultHeadTest(name, nickname));
      }
    };

    const selectedTest = tests.find(t => t.name === selectedTestName);

    return (
      <TestsFormLayout
        sidebar={
          <Sidebar<HeadTest>
            tests={tests}
            selectedTestName={selectedTestName}
            onTestPriorityChange={onTestPriorityChange}
            onTestSelected={onTestSelected}
            createTest={createTest}
            isInEditMode={editMode}
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
            onBatchTestDelete={onBatchTestDelete}
            onBatchTestArchive={onBatchTestArchive}
          />
        }
        testEditor={
          // needed to convince typescript neither are undefined
          selectedTestName && selectedTest ? (
            <HeadTestEditor
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
  return HeadTestsForm;
};

export const HeadTestsForm1 = TestsForm(
  getHeadTestsForm(true),
  FrontendSettingsType.headTests,
);
export const HeadTestsForm2 = TestsForm(
  getHeadTestsForm(false),
  FrontendSettingsType.headTests2,
);
