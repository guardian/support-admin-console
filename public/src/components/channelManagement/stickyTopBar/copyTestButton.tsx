import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import { Button, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { grey } from '@mui/material/colors';
import CreateTestDialog from '../createTestDialog';

const useStyles = makeStyles(({ palette }: Theme) => ({
  buttonText: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: palette.grey[800],
  },
}));

interface CopyTestButtonProps {
  existingNames: string[];
  existingNicknames: string[];
  sourceName: string;
  sourceNickname?: string;
  testNamePrefix?: string;
  onCopyTest: (
    oldName: string,
    newName: string,
    newNickname: string,
    campaignName?: string,
  ) => void;
  disabled: boolean;
}

export const CopyTestButton: React.FC<CopyTestButtonProps> = ({
  existingNames,
  existingNicknames,
  sourceName,
  sourceNickname,
  testNamePrefix,
  onCopyTest,
  disabled,
}: CopyTestButtonProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button
        onClick={open}
        variant="outlined"
        startIcon={<FileCopyIcon style={{ color: grey[700] }} />}
        size="medium"
        disabled={disabled}
      >
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
        createTest={(newName, newNickname, campaignName) =>
          onCopyTest(sourceName, newName, newNickname, campaignName)
        }
      />
    </>
  );
};
