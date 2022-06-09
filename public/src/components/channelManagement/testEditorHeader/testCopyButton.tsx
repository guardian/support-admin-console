import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import {Button, makeStyles, Theme, Typography} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {grey} from '@material-ui/core/colors';
import CreateTestDialog from '../createTestDialog';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  buttonText: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: palette.grey[800],
  },
}));

interface TestCopyButtonProps {
  existingNames: string[];
  existingNicknames: string[];
  sourceName: string;
  sourceNickname?: string;
  testNamePrefix?: string;
  onTestCopy: (oldName: string, newName: string, newNickname: string) => void;
}

export const TestCopyButton: React.FC<TestCopyButtonProps> = ({
  existingNames,
  existingNicknames,
  sourceName,
  sourceNickname,
  testNamePrefix,
  onTestCopy,
}) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button
        onClick={open}
        variant="outlined"
        startIcon={<FileCopyIcon style={{ color: grey[700] }} />}
        size="medium"
      >
        {/* eslint-disable-next-line react/prop-types */}
        <Typography className={classes.buttonText}>Copy test</Typography>
      </Button>
      <CreateTestDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        sourceName={sourceName}
        existingNicknames={existingNicknames}
        sourceNickname={sourceNickname}
        testNamePrefix={testNamePrefix}
        mode="COPY"
        createTest={(newName, newNickname) => onTestCopy(sourceName, newName, newNickname)}
      />
    </>
  );
};
