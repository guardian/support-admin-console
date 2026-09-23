import { styled } from '@mui/material/styles';
import React, { useRef } from 'react';
import { Test } from './helpers/shared';
import useValidation from './hooks/useValidation';
import StickyTopBar from './stickyTopBar/stickyTopBar';
import TestSchedulerStatusBanner from './testSchedulerStatusBanner';
import { TestEditorProps } from './testsForm';

const TestEditorContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  background: theme.palette.background.paper, // #FFFFFF
  borderLeft: `1px solid ${theme.palette.grey[500]}`,
}));
const ScrollableContainer = styled('div')(({ theme }) => ({
  overflowY: 'auto',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(2),
}));

export interface ValidatedTestEditorProps<T extends Test> {
  test: T;
  userHasTestLocked: boolean;
  showMParticleMenu: boolean;
  onTestChange: (update: (current: T) => T) => void;
  setValidationStatusForField: (fieldName: string, isValid: boolean) => void;
}

/**
 * Higher-order component which wraps a custom channel test editor.
 * It renders the StickyTopBar and handles validation.
 */
export const ValidatedTestEditor = <T extends Test>(
  TestEditor: React.ComponentType<ValidatedTestEditorProps<T>>,
  testNamePrefix?: string,
): React.FC<TestEditorProps<T>> => {
  const Editor: React.FC<TestEditorProps<T>> = ({
    test,
    onTestChange,
    userHasTestLocked,
    userHasTestListLocked,
    onTestLock,
    onTestUnlock,
    onTestSave,
    onTestArchive,
    onTestCopy,
    onTestAudit,
    existingNames,
    existingNicknames,
    settingsType,
    onStatusChange,
    allowEditing,
  }: TestEditorProps<T>) => {
    /**
     * The useRef is necessary here to avoid bugs where updates can be lost.
     * This can happen when a RichTextEditor field changes a field after another field has changed.
     * For some reason in that case it can "close over" the old version of the test data, causing other changes to be lost.
     * In future we should explore refactoring these components to make better use of react-hook-form and react.
     */
    const testRef = useRef(test);
    const isValidRef = useRef<boolean>(true);

    const setValidationStatusForField = useValidation((updatedIsValid) => {
      isValidRef.current = updatedIsValid;
    });

    const onSave = (): void => {
      if (isValidRef.current) {
        onTestSave(test.name);
      } else {
        alert('Test contains errors. Please fix any errors before saving.');
      }
    };

    const onUpdate = (updatedTest: T): void => {
      testRef.current = updatedTest;
      onTestChange(updatedTest);
    };

    return (
      <TestEditorContainer>
        <StickyTopBar
          name={test.name}
          nickname={test.nickname}
          channel={test.channel}
          campaignName={test.campaignName}
          isNew={!!test.isNew}
          status={test.status}
          lockStatus={test.lockStatus ?? { locked: false }}
          userHasTestLocked={userHasTestLocked}
          userHasTestListLocked={userHasTestListLocked}
          existingNames={existingNames}
          existingNicknames={existingNicknames}
          testNamePrefix={testNamePrefix}
          onTestLock={onTestLock}
          onTestUnlock={onTestUnlock}
          onTestSave={onSave}
          onTestArchive={() => onTestArchive(test.name)}
          onTestCopy={onTestCopy}
          onTestAudit={onTestAudit}
          onStatusChange={onStatusChange}
          settingsType={settingsType}
          allowEditing={allowEditing}
        />

        <ScrollableContainer>
          {test.scheduler && (
            <TestSchedulerStatusBanner scheduler={test.scheduler} status={test.status} />
          )}
          <TestEditor
            test={test}
            userHasTestLocked={userHasTestLocked}
            showMParticleMenu={test.name.startsWith('MPARTICLE_ATTRIBUTES_')}
            onTestChange={(update) => onUpdate(update(test))}
            setValidationStatusForField={setValidationStatusForField}
          />
        </ScrollableContainer>
      </TestEditorContainer>
    );
  };
  return Editor;
};
