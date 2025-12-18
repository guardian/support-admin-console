import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { PermissionLevel, UserPermissions } from '../channelManagement/helpers/shared';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { hasPermission } from '../../utils/permissions';
import AccessManagementDialog from './UpdatePermissionsDialog';
import AddUserDialog from './AddUserDialog';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    padding: spacing(4),
  },
  tableContainer: {
    marginTop: spacing(2),
  },
  permissionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing(1),
    marginBottom: spacing(0.5),
  },
  permissionIcon: {
    fontSize: '18px',
  },
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
  addUserButton: {
    marginTop: spacing(3),
  },
}));

const formatPermissionName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AccessManagement = () => {
  const classes = useStyles();
  const [users, setUsers] = React.useState<UserPermissions[]>();
  const [loading, setLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserPermissions | null>(null);
  const [landingPagePerm, setLandingPagePerm] = React.useState<PermissionLevel>('None');
  const [checkoutNudgePerm, setCheckoutNudgePerm] = React.useState<PermissionLevel>('None');
  const [addUserModalOpen, setAddUserModalOpen] = React.useState(false);
  const [newUserEmail, setNewUserEmail] = React.useState('');
  const [newUserLandingPagePerm, setNewUserLandingPagePerm] = React.useState<PermissionLevel>(
    'None',
  );
  const [newUserCheckoutNudgePerm, setNewUserCheckoutNudgePerm] = React.useState<PermissionLevel>(
    'None',
  );
  const canEditPermissions = hasPermission('access-management', 'Write');
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('frontend/access-management/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);
  const handleOpenModal = (user: UserPermissions) => {
    setSelectedUser(user);
    const landingPagePermission = user.permissions.find(
      p => p.name === 'support-landing-page-tests',
    );
    const checkoutNudgePermission = user.permissions.find(p => p.name === 'checkout-nudge-tests');
    setLandingPagePerm(landingPagePermission ? landingPagePermission.permission : 'None');
    setCheckoutNudgePerm(checkoutNudgePermission ? checkoutNudgePermission.permission : 'None');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setLandingPagePerm('None');
    setCheckoutNudgePerm('None');
  };

  const handleOpenAddUserModal = () => {
    setNewUserEmail('');
    setNewUserLandingPagePerm('None');
    setNewUserCheckoutNudgePerm('None');
    setAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setAddUserModalOpen(false);
    setNewUserEmail('');
    setNewUserLandingPagePerm('None');
    setNewUserCheckoutNudgePerm('None');
  };

  const handleAddUser = async () => {
    if (!newUserEmail) {
      return;
    }

    const permissions = [];

    if (newUserLandingPagePerm !== 'None') {
      permissions.push({
        name: 'support-landing-page-tests',
        permission: newUserLandingPagePerm as 'Read' | 'Write',
      });
    }

    if (newUserCheckoutNudgePerm !== 'None') {
      permissions.push({
        name: 'checkout-nudge-tests',
        permission: newUserCheckoutNudgePerm as 'Read' | 'Write',
      });
    }

    const newUser: UserPermissions = {
      email: newUserEmail,
      permissions,
    };

    try {
      const response = await fetch('frontend/access-management/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(prevUsers => (prevUsers ? [...prevUsers, data] : [data]));
        handleCloseAddUserModal();
      } else {
        console.error('Failed to add user:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) {
      return;
    }
    const updatedPermissions = selectedUser.permissions.filter(
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
      email: selectedUser.email,
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
        setUsers(prevUsers =>
          prevUsers ? prevUsers.map(user => (user.email === data.email ? data : user)) : [data],
        );
        handleCloseModal();
      } else {
        console.error('Failed to update user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  return (
    <div className={classes.container}>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <div>
          {users && users.length > 0 ? (
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Permissions</TableCell>
                    {canEditPermissions && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.email} hover>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.permissions.map(perm => (
                          <div
                            key={`${user.email}-${perm.name}`}
                            className={classes.permissionItem}
                          >
                            <span>{formatPermissionName(perm.name)}:</span>
                            {perm.permission === 'Write' ? (
                              <>
                                <EditIcon className={classes.permissionIcon} color="primary" />
                                <strong>Read & Write</strong>
                              </>
                            ) : (
                              <>
                                <VisibilityIcon className={classes.permissionIcon} color="action" />
                                <strong>Read only</strong>
                              </>
                            )}
                          </div>
                        ))}
                      </TableCell>
                      {canEditPermissions && (
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenModal(user)}
                          >
                            Edit permissions
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No users found.</Typography>
          )}

          {canEditPermissions && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddUserModal}
              className={classes.addUserButton}
            >
              Add user
            </Button>
          )}
        </div>
      )}

      <AccessManagementDialog
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        selectedUser={selectedUser}
        landingPagePerm={landingPagePerm}
        setLandingPagePerm={setLandingPagePerm}
        checkoutNudgePerm={checkoutNudgePerm}
        setCheckoutNudgePerm={setCheckoutNudgePerm}
        handleSavePermissions={handleSavePermissions}
        classes={classes}
      />

      <AddUserDialog
        modalOpen={addUserModalOpen}
        handleCloseModal={handleCloseAddUserModal}
        email={newUserEmail}
        setEmail={setNewUserEmail}
        landingPagePerm={newUserLandingPagePerm}
        setLandingPagePerm={setNewUserLandingPagePerm}
        checkoutNudgePerm={newUserCheckoutNudgePerm}
        setCheckoutNudgePerm={setNewUserCheckoutNudgePerm}
        handleAddUser={handleAddUser}
        classes={classes}
      />
    </div>
  );
};

export default AccessManagement;
