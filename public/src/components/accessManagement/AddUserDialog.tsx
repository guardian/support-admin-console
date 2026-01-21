import React, { useState } from 'react';
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
  Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import { PermissionLevel, UserPermissions } from '../channelManagement/helpers/shared';
import { saveUserPermissions } from '../../utils/requests';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  dialogHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingRight: spacing(1),
  },
  dialogTitle: {
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    paddingRight: spacing(1),
    flexShrink: 1,
  },
  formControl: {
    marginBottom: spacing(3),
  },
}));

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: (user: UserPermissions) => void;
}

const AddUserDialog = ({ open, onClose, onUserAdded }: AddUserDialogProps) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [landingPagePerm, setLandingPagePerm] = useState<PermissionLevel>('None');
  const [checkoutNudgePerm, setCheckoutNudgePerm] = useState<PermissionLevel>('None');

  const handleClose = () => {
    setEmail('');
    setLandingPagePerm('None');
    setCheckoutNudgePerm('None');
    onClose();
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      return;
    }

    const permissions = [];

    if (landingPagePerm !== 'None') {
      permissions.push({
        name: 'support-landing-page-tests',
        permission: landingPagePerm as 'Read' | 'Write',
      });
    }

    if (checkoutNudgePerm !== 'None') {
      permissions.push({
        name: 'checkout-nudge-tests',
        permission: checkoutNudgePerm as 'Read' | 'Write',
      });
    }

    const newUser: UserPermissions = {
      email,
      permissions,
    };

    try {
      const response = await saveUserPermissions(newUser);
      const data = await response.json();
      onUserAdded(data);
      handleClose();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <div className={classes.dialogHeader}>
        <DialogTitle className={classes.dialogTitle}>Add New User</DialogTitle>
        <IconButton onClick={handleClose} size="small">
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@guardian.co.uk"
          variant="outlined"
          style={{ marginBottom: '24px' }}
        />

        <FormControl component="fieldset" className={classes.formControl} fullWidth>
          <FormLabel component="legend">Support Landing Page Tests</FormLabel>
          <RadioGroup
            value={landingPagePerm}
            onChange={(e) => setLandingPagePerm(e.target.value as 'Read' | 'Write' | 'None')}
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
            onChange={(e) => setCheckoutNudgePerm(e.target.value as 'Read' | 'Write' | 'None')}
          >
            <FormControlLabel value="None" control={<Radio />} label="No Access" />
            <FormControlLabel value="Read" control={<Radio />} label="Read Only" />
            <FormControlLabel value="Write" control={<Radio />} label="Read & Write" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!email.trim()}>
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
