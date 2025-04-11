export const hasPermission = (name: string, requiredPermission: 'Read' | 'Write') => {
  const permissions = window.guardian.permissions;
  const userPermission = permissions.find(perm => perm.name === name);
  if (userPermission) {
    if (requiredPermission === 'Write') {
      return userPermission.permission === 'Write';
    } else {
      return true;
    }
  }
  return false;
};
