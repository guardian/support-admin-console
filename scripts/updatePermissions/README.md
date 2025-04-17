A script for adding RRCP permissions for users. It handles new and existing users.

Permissions are stored in a DynamoDb table, `support-admin-console-permissions-${Stage}`.

We do not yet have a tool for maintaining these permissions, so for now we can use this script.

### Usage:
From this directory, run:
```
Stage=DEV \
PermissionLevel=Write \
PermissionName=support-landing-page-tests \
Emails=test.user1@guardian.co.uk,test.user2@guardian.co.uk \
pnpm updatePermissions
```

This creates/updates items in the table, e.g.
```
{
 "email": "test.user1@guardian.co.uk",
 "permissions": [
  {
   "name": "support-landing-page-tests",
   "permission": "Write"
  }
 ]
}
```
