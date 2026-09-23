import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { hasPermission } from '../../utils/permissions';
import { fetchUsersWithPermissions, FrontendSettingsType } from '../../utils/requests';
import { UserPermissions } from '../channelManagement/helpers/shared';
import AddUserDialog from './AddUserDialog';
import { permissions } from './permissions';
import AccessManagementDialog from './UpdatePermissionsDialog';

const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
})) as typeof TableContainer;

const PermissionItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

const PermissionEditIcon = styled(EditIcon)({
  fontSize: '18px',
});

const PermissionVisibilityIcon = styled(VisibilityIcon)({
  fontSize: '18px',
});

const AddUserButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const formatPermissionName = (name: string): string => {
  return (
    permissions.find((perm) => perm.name === name)?.displayName ??
    name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};

const AccessManagement = () => {
  const [users, setUsers] = React.useState<UserPermissions[]>();
  const [loading, setLoading] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserPermissions | null>(null);
  const [addUserModalOpen, setAddUserModalOpen] = React.useState(false);
  const canEditPermissions = hasPermission(FrontendSettingsType.AccessManagement, 'Write');

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
    void getUsers();
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
    setUsers((prevUsers) =>
      prevUsers
        ? prevUsers.map((user) => (user.email === updatedUser.email ? updatedUser : user))
        : [updatedUser],
    );
    handleCloseEditModal();
  };

  const handleUserAdded = (newUser: UserPermissions) => {
    setUsers((prevUsers) => (prevUsers ? [...prevUsers, newUser] : [newUser]));
    setAddUserModalOpen(false);
  };
  return (
    <Container>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <div>
          {users && users.length > 0 ? (
            <StyledTableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Permissions</TableCell>
                    {canEditPermissions && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.email} hover>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.permissions.map((perm) => (
                          <PermissionItem key={`${user.email}-${perm.name}`}>
                            <span>{formatPermissionName(perm.name)}:</span>
                            {perm.permission === 'Write' ? (
                              <>
                                <PermissionEditIcon color="primary" />
                                <strong>Read & Write</strong>
                              </>
                            ) : (
                              <>
                                <PermissionVisibilityIcon color="action" />
                                <strong>Read only</strong>
                              </>
                            )}
                          </PermissionItem>
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
            </StyledTableContainer>
          ) : (
            <Typography>No users found.</Typography>
          )}

          {canEditPermissions && (
            <AddUserButton
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddUserModalOpen(true)}
            >
              Add user
            </AddUserButton>
          )}
        </div>
      )}

      {selectedUser && (
        <AccessManagementDialog
          open={editModalOpen}
          onClose={handleCloseEditModal}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      )}

      <AddUserDialog
        open={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </Container>
  );
};

export default AccessManagement;
