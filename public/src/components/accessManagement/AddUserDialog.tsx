import CloseIcon from '@mui/icons-material/Close';
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
import { styled } from '@mui/material/styles';
import React, { useState } from 'react'; // eslint-disable-line @typescript-eslint/no-unused-vars -- Required for JSX compilation
import { saveUserPermissions } from '../../utils/requests';
import { PermissionLevel, UserPermissions } from '../channelManagement/helpers/shared';
import { PermissionName, permissions } from './permissions';

const DialogHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(1),
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  paddingRight: theme.spacing(1),
  flexShrink: 1,
}));

const EmailField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(3),
})) as typeof FormControl;

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: (user: UserPermissions) => void;
}

const AddUserDialog = ({ open, onClose, onUserAdded }: AddUserDialogProps) => {
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
      const data = (await response.json()) as UserPermissions;
      onUserAdded(data);
      handleClose();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogHeader>
        <StyledDialogTitle>Add New User</StyledDialogTitle>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogHeader>
      <DialogContent dividers>
        <EmailField
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@guardian.co.uk"
          variant="outlined"
        />

        {permissions.map((perm) => (
          <StyledFormControl key={perm.name} component="fieldset" fullWidth>
            <FormLabel component="legend">{perm.displayName}</FormLabel>
            <RadioGroup
              value={selectedPermissions[perm.name] ?? 'None'}
              onChange={(e) => handlePermissionChange(perm.name, e.target.value as PermissionLevel)}
            >
              <FormControlLabel value="None" control={<Radio />} label="No Access" />
              <FormControlLabel value="Read" control={<Radio />} label="Read Only" />
              <FormControlLabel value="Write" control={<Radio />} label="Read & Write" />
            </RadioGroup>
          </StyledFormControl>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            void handleSubmit();
          }}
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
