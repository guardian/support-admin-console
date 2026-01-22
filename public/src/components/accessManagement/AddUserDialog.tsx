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

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: (user: UserPermissions) => void;
}

const AddUserDialog = ({ open, onClose, onUserAdded }: AddUserDialogProps) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<PermissionName, PermissionLevel>
  >({});

  const handleClose = () => {
    onClose();
  };

  const handlePermissionChange = (permissionName: string, value: PermissionLevel) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionName]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      return;
    }

    const userPermissions = Object.entries(selectedPermissions)
      .filter(([, level]) => level !== 'None')
      .map(([name, level]) => ({
        name,
        permission: level,
      }));

    const newUser: UserPermissions = {
      email,
      permissions: userPermissions,
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

        {permissions.map((perm) => (
          <FormControl
            key={perm.name}
            component="fieldset"
            className={classes.formControl}
            fullWidth
          >
            <FormLabel component="legend">{perm.displayName}</FormLabel>
            <RadioGroup
              value={selectedPermissions[perm.name] || 'None'}
              onChange={(e) => handlePermissionChange(perm.name, e.target.value as PermissionLevel)}
            >
              <FormControlLabel value="None" control={<Radio />} label="No Access" />
              <FormControlLabel value="Read" control={<Radio />} label="Read Only" />
              <FormControlLabel value="Write" control={<Radio />} label="Read & Write" />
            </RadioGroup>
          </FormControl>
        ))}
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
