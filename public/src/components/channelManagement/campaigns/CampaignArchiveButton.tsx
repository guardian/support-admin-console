import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import ArchiveIcon from '@material-ui/icons/Archive';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(({ palette }: Theme) => ({
  buttonText: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: palette.grey[800],
  },
}));

interface CampaignArchiveButtonProps {
  onCampaignArchive: () => void;
}

export const CampaignArchiveButton: React.FC<CampaignArchiveButtonProps> = ({
  onCampaignArchive,
}: CampaignArchiveButtonProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ArchiveIcon style={{ color: grey[700] }} />}
        size="medium"
        onClick={open}
      >
        {/* eslint-disable-next-line react/prop-types */}
        <Typography className={classes.buttonText}>Archive campaign</Typography>
      </Button>
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby="archive-campaign-dialog-title"
        aria-describedby="archive-campaign-dialog-description"
      >
        <DialogTitle id="archive-campaign-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="archive-campaign-dialog-description">
            Archiving this campaign will remove it from the RRCP - you can only restore it with an
            engineer&apos;s help.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={close}>
            Cancel
          </Button>
          <Button color="primary" onClick={onCampaignArchive}>
            Archive campaign
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
