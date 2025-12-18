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
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PermissionLevel } from '../channelManagement/helpers/shared';

interface AddUserDialogProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  email: string;
  setEmail: (value: string) => void;
  landingPagePerm: PermissionLevel;
  setLandingPagePerm: (value: PermissionLevel) => void;
  checkoutNudgePerm: PermissionLevel;
  setCheckoutNudgePerm: (value: PermissionLevel) => void;
  handleAddUser: () => void;
  classes: { [key: string]: string };
}

const AddUserDialog = ({
  modalOpen,
  handleCloseModal,
  email,
  setEmail,
  landingPagePerm,
  setLandingPagePerm,
  checkoutNudgePerm,
  setCheckoutNudgePerm,
  handleAddUser,
  classes,
}: AddUserDialogProps) => {
  return (
    <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <div className={classes.dialogHeader}>
        <DialogTitle className={classes.dialogTitle}>Add New User</DialogTitle>
        <IconButton onClick={handleCloseModal} size="small">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="user@guardian.co.uk"
          variant="outlined"
          style={{ marginBottom: '24px' }}
        />

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
        <Button
          onClick={handleAddUser}
          variant="contained"
          color="primary"
          disabled={!email.trim()}
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
