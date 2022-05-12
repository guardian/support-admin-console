import TestsForm, { InnerComponentProps } from '../testEditor';
import React from 'react';
import { FrontendSettingsType } from '../../../utils/requests';
import Sidebar from '../sidebar';
import HeaderTestEditor from './headerTestEditor';
import TestsFormLayout from '../testsFormLayout';
import { HeaderTest } from '../../../models/header';
import { getDefaultTest } from './utils/defaults';

type Props = InnerComponentProps<HeaderTest>;

const getHeaderTestsForm = (): React.FC<Props> => {
  const createDefaultHeaderTest = (newTestName: string, newTestNickname: string): HeaderTest => ({
    ...getDefaultTest(),
    name: newTestName,
    nickname: newTestNickname,
  });

  const HeaderTestsForm: React.FC<Props> = ({
    tests,
    selectedTestName,
    editedTestName,
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
    saving,
  }: Props) => {
    const createTest = (name: string, nickname: string): void => {
      onTestCreate(createDefaultHeaderTest(name, nickname));
    };

    const selectedTest = tests.find(t => t.name === selectedTestName);
    const selectedTestIsBeingEdited = selectedTestName === editedTestName;

    return (
      <TestsFormLayout
        sidebar={
          <Sidebar<HeaderTest>
            tests={tests}
            selectedTestName={selectedTestName}
            editedTestName={editedTestName}
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
            <HeaderTestEditor
              test={selectedTest}
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
  return HeaderTestsForm;
};

export const HeaderTestsForm = TestsForm(getHeaderTestsForm(), FrontendSettingsType.headerTests);
