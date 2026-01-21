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
import { saveUserPermissions } from '../../utils/requests';
import { PermissionName, permissions } from './permissions';

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
  const [permissionValues, setPermissionValues] = useState<Record<PermissionName, PermissionLevel>>(
    {},
  );

  useEffect(() => {
    if (user) {
      const initialValues = permissions.reduce<Record<string, PermissionLevel>>((acc, perm) => {
        const userPerm = user.permissions.find((p) => p.name === perm.name);
        acc[perm.name] = userPerm ? userPerm.permission : 'None';
        return acc;
      }, {});
      setPermissionValues(initialValues);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      return;
    }

    const updatedPermissions = Object.entries(permissionValues)
      .filter(([, level]) => level !== 'None')
      .map(([name, level]) => ({
        name,
        permission: level,
      }));

    const updatedUser: UserPermissions = {
      email: user.email,
      permissions: updatedPermissions,
    };

    try {
      const response = await saveUserPermissions(updatedUser);
      const data = await response.json();
      onUserUpdated(data);
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
        {permissions.map((perm) => (
          <FormControl
            key={perm.name}
            component="fieldset"
            className={classes.formControl}
            fullWidth
          >
            <FormLabel component="legend">{perm.displayName}</FormLabel>
            <RadioGroup
              value={permissionValues[perm.name] || 'None'}
              onChange={(e) =>
                setPermissionValues({
                  ...permissionValues,
                  [perm.name]: e.target.value as PermissionLevel,
                })
              }
            >
              <FormControlLabel value="None" control={<Radio />} label="No Access" />
              <FormControlLabel value="Read" control={<Radio />} label="Read Only" />
              <FormControlLabel value="Write" control={<Radio />} label="Read & Write" />
            </RadioGroup>
          </FormControl>
        ))}
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
