import React, { useEffect, useState } from 'react';
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
  Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import { PermissionLevel, UserPermissions } from '../channelManagement/helpers/shared';

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

interface AccessManagementDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserPermissions | null;
  onUserUpdated: (user: UserPermissions) => void;
}

const AccessManagementDialog = ({
  open,
  onClose,
  user,
  onUserUpdated,
}: AccessManagementDialogProps) => {
  const classes = useStyles();
  const [landingPagePerm, setLandingPagePerm] = useState<PermissionLevel>('None');
  const [checkoutNudgePerm, setCheckoutNudgePerm] = useState<PermissionLevel>('None');

  useEffect(() => {
    if (user) {
      const landingPagePermission = user.permissions.find(
        p => p.name === 'support-landing-page-tests',
      );
      const checkoutNudgePermission = user.permissions.find(p => p.name === 'checkout-nudge-tests');
      setLandingPagePerm(landingPagePermission ? landingPagePermission.permission : 'None');
      setCheckoutNudgePerm(checkoutNudgePermission ? checkoutNudgePermission.permission : 'None');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      return;
    }

    const updatedPermissions = user.permissions.filter(
      p => p.name !== 'support-landing-page-tests' && p.name !== 'checkout-nudge-tests',
    );

    if (landingPagePerm !== 'None') {
      updatedPermissions.push({
        name: 'support-landing-page-tests',
        permission: landingPagePerm as 'Read' | 'Write',
      });
    }

    if (checkoutNudgePerm !== 'None') {
      updatedPermissions.push({
        name: 'checkout-nudge-tests',
        permission: checkoutNudgePerm as 'Read' | 'Write',
      });
    }

    const updatedUser: UserPermissions = {
      email: user.email,
      permissions: updatedPermissions,
    };

    try {
      const response = await fetch('frontend/access-management/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        const data = await response.json();
        onUserUpdated(data);
      } else {
        console.error('Failed to update user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className={classes.dialogHeader}>
        <DialogTitle className={classes.dialogTitle}>
          Edit Permissions for {user?.email}
        </DialogTitle>
        <IconButton onClick={onClose} size="small">
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccessManagementDialog;
