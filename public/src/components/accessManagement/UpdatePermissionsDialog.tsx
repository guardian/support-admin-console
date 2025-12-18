import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PermissionLevel } from '../channelManagement/helpers/shared';

interface AccessManagementDialogProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  selectedUser: { email: string } | null;
  landingPagePerm: PermissionLevel;
  setLandingPagePerm: (value: PermissionLevel) => void;
  checkoutNudgePerm: PermissionLevel;
  setCheckoutNudgePerm: (value: PermissionLevel) => void;
  handleSavePermissions: () => void;
  classes: { [key: string]: string };
}

const AccessManagementDialog = ({
  modalOpen,
  handleCloseModal,
  selectedUser,
  landingPagePerm,
  setLandingPagePerm,
  checkoutNudgePerm,
  setCheckoutNudgePerm,
  handleSavePermissions,
  classes,
}: AccessManagementDialogProps) => {
  return (
    <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <div className={classes.dialogHeader}>
        <DialogTitle className={classes.dialogTitle}>
          Edit Permissions for {selectedUser?.email}
        </DialogTitle>
        <IconButton onClick={handleCloseModal} size="small">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <FormControl component="fieldset" className={classes.formControl} fullWidth>
          <FormLabel component="legend">Support Landing Page Tests</FormLabel>
          <RadioGroup
            value={landingPagePerm}
            onChange={e => setLandingPagePerm(e.target.value as 'Read' | 'Write' | 'None')}
          >
            <FormControlLabel value="None" control={<Radio />} label="No Access" />
            <FormControlLabel value="Read" control={<Radio />} label="Read Only" />
            <FormControlLabel value="Write" control={<Radio />} label="Read & Write" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" className={classes.formControl} fullWidth>
          <FormLabel component="legend">Checkout Nudge Tests</FormLabel>
          <RadioGroup
            value={checkoutNudgePerm}
            onChange={e => setCheckoutNudgePerm(e.target.value as 'Read' | 'Write' | 'None')}
          >
            <FormControlLabel value="None" control={<Radio />} label="No Access" />
            <FormControlLabel value="Read" control={<Radio />} label="Read Only" />
            <FormControlLabel value="Write" control={<Radio />} label="Read & Write" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Button onClick={handleSavePermissions} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccessManagementDialog;
