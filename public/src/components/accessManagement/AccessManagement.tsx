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
import { UserPermissions } from '../channelManagement/helpers/shared';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { hasPermission } from '../../utils/permissions';
import { fetchUsersWithPermissions, FrontendSettingsType } from '../../utils/requests';
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
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserPermissions | null>(null);
  const [addUserModalOpen, setAddUserModalOpen] = React.useState(false);
  const canEditPermissions = hasPermission(FrontendSettingsType.accessManagement, 'Write');

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsersWithPermissions();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleOpenEditModal = (user: UserPermissions) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = (updatedUser: UserPermissions) => {
    setUsers(prevUsers =>
      prevUsers
        ? prevUsers.map(user => (user.email === updatedUser.email ? updatedUser : user))
        : [updatedUser],
    );
    handleCloseEditModal();
  };

  const handleUserAdded = (newUser: UserPermissions) => {
    setUsers(prevUsers => (prevUsers ? [...prevUsers, newUser] : [newUser]));
    setAddUserModalOpen(false);
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
                            onClick={() => handleOpenEditModal(user)}
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
              onClick={() => setAddUserModalOpen(true)}
              className={classes.addUserButton}
            >
              Add user
            </Button>
          )}
        </div>
      )}

      <AccessManagementDialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />

      <AddUserDialog
        open={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default AccessManagement;
