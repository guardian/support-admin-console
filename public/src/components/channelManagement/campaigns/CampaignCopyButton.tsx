import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import { Button, makeStyles, Theme, Typography } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { grey } from '@material-ui/core/colors';
import CreateCampaignDialog from './CreateCampaignDialog';

const useStyles = makeStyles(({ palette }: Theme) => ({
  buttonText: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: palette.grey[800],
  },
}));

interface CampaignCopyButtonProps {
  existingNames: string[];
  existingNicknames: string[];
  disabled: boolean;
}

// const voidAction = () => {};

export const CampaignCopyButton: React.FC<CampaignCopyButtonProps> = ({
  existingNames,
  existingNicknames,
  disabled,
}: CampaignCopyButtonProps) => {
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
        <Typography className={classes.buttonText}>Copy campaign</Typography>
      </Button>
      <CreateCampaignDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        existingNicknames={existingNicknames}
        // createCampaign={voidAction}
      />
    </>
  );
};
