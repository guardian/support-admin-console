import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { Campaign } from './CampaignsForm';
import { Test } from '../helpers/shared';
import StatusUpdateDialog from './StatusUpdateDialog';
import useOpenable from '../../../hooks/useOpenable';

const useStyles = makeStyles(() => ({
  button: {
    justifyContent: 'start',
    height: '36px',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}));

interface StatusUpdateButtonProps {
  // existingNames: string[];
  // existingNicknames: string[];
  // createCampaign: (campaign: Campaign) => void;
  tests: Test[];
}

const StatusUpdateButton: React.FC<StatusUpdateButtonProps> = ({
  // existingNames,
  // existingNicknames,
  // createCampaign,
  tests,
}: StatusUpdateButtonProps) => {
  const [isOpen, open, close] = useOpenable();
  const classes = useStyles();

  return (
    <>
      <Button className={classes.button} variant="outlined" onClick={open}>
        <Typography className={classes.text}>Update Test statuses on theguardian.com</Typography>
      </Button>
      <StatusUpdateDialog
        isOpen={isOpen}
        close={close}
        tests={tests}
        // existingNames={existingNames}
        // existingNicknames={existingNicknames}
        // createCampaign={createCampaign}
      />
    </>
  );
};

export default StatusUpdateButton;
