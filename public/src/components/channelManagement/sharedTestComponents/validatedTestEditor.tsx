import { Test } from '../helpers/shared';
import React, { useState } from 'react';
import { TestEditorProps } from './testsForm';
import StickyTopBar from '../stickyTopBar/stickyTopBar';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useValidation from '../hooks/useValidation';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  testEditorContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper, // #FFFFFF
    borderLeft: `1px solid ${palette.grey[500]}`,
  },
  scrollableContainer: {
    overflowY: 'auto',
    paddingLeft: spacing(3),
    paddingRight: spacing(1),
    paddingTop: spacing(2),
  },
}));

export interface ValidatedTestEditorProps<T extends Test> {
  test: T;
  userHasTestLocked: boolean;
  onTestChange: (test: T) => void;
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
    existingNames,
    existingNicknames,
    settingsType,
    onStatusChange,
  }: TestEditorProps<T>) => {
    const classes = useStyles();
    const [isValid, setIsValid] = useState<boolean>(true);

    const setValidationStatusForField = useValidation(setIsValid);

    const onSave = (): void => {
      if (isValid) {
        onTestSave(test.name);
      } else {
        alert('Test contains errors. Please fix any errors before saving.');
      }
    };

    return (
      <div className={classes.testEditorContainer}>
        <StickyTopBar
          name={test.name}
          nickname={test.nickname}
          campaignName={test.campaignName}
          isNew={!!test.isNew}
          status={test.status}
          lockStatus={test.lockStatus || { locked: false }}
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
          onStatusChange={onStatusChange}
          settingsType={settingsType}
        />

        <div className={classes.scrollableContainer}>
          <TestEditor
            test={test}
            userHasTestLocked={userHasTestLocked}
            onTestChange={onTestChange}
            setValidationStatusForField={setValidationStatusForField}
          />
        </div>
      </div>
    );
  };
  return Editor;
};
