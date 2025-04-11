import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import { Button, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { grey } from '@mui/material/colors';
import CreateTestDialog from '../createTestDialog';

const useStyles = makeStyles(({ palette }: Theme) => ({
  button: {
    color: palette.grey[800],
    '& > p': {
      fontSize: '14px',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  },
}));

interface TestCopyButtonProps {
  existingNames: string[];
  existingNicknames: string[];
  sourceName: string;
  sourceNickname?: string;
  testNamePrefix?: string;
  onTestCopy: (
    oldName: string,
    newName: string,
    newNickname: string,
    campaignName?: string,
  ) => void;
  disabled: boolean;
}

export const TestCopyButton: React.FC<TestCopyButtonProps> = ({
  existingNames,
  existingNicknames,
  sourceName,
  sourceNickname,
  testNamePrefix,
  onTestCopy,
  disabled,
}: TestCopyButtonProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button
        className={classes.button}
        onClick={open}
        variant="outlined"
        startIcon={<FileCopyIcon style={{ color: grey[700] }} />}
        size="medium"
        disabled={disabled}
      >
        <Typography>Copy test</Typography>
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
        createTest={(newName, newNickname, campaignName) =>
          onTestCopy(sourceName, newName, newNickname, campaignName)
        }
      />
    </>
  );
};
