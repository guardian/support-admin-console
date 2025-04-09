import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const REGION = 'eu-west-1';
const client = new DynamoDBClient({ region: REGION });
const dynamoDB = DynamoDBDocumentClient.from(client);

const { Stage, PermissionName, PermissionLevel, Emails } = process.env;
if (!Stage || !PermissionLevel || !PermissionName || !Emails) {
  console.error('Missing parameter');
  console.log('Example usage:\n' +
    'Stage=DEV \\\n' +
    'PermissionLevel=Write \\\n' +
    'PermissionName=support-landing-page-tests \\\n' +
    'Emails=test.user1@guardian.co.uk,test.user2@guardian.co.uk \\\n' +
    'pnpm updatePermissions'
  );
  process.exit(1);
}

const TABLE_NAME = `support-admin-console-permissions-${Stage}`;

async function updatePermissions(
  permissionName: string,
  permissionLevel: string,
  emailAddresses: string[]
): Promise<void> {
  for (const email of emailAddresses) {
    try {
      await dynamoDB.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { email },
          UpdateExpression: 'SET #permissions = list_append(if_not_exists(#permissions, :emptyList), :newPermission)',
          ExpressionAttributeNames: {
            '#permissions': 'permissions',
          },
          ExpressionAttributeValues: {
            ':newPermission': [{ name: permissionName, permission: permissionLevel }],
            ':emptyList': [],
          },
          ConditionExpression: 'attribute_exists(email)',
        })
      );
      console.log(`Successfully updated permissions for ${email}`);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        // Item does not exist, create it
        try {
          await dynamoDB.send(
            new PutCommand({
              TableName: TABLE_NAME,
              Item: {
                email,
                permissions: [{ name: permissionName, permission: permissionLevel }],
              },
            })
          );
          console.log(`Created new item and added permissions for ${email}`);
        } catch (putError) {
          console.error(`Failed to create item for ${email}:`, putError);
        }
      } else {
        console.error(`Failed to update permissions for ${email}:`, error);
      }
    }
  }
}

console.log({PermissionName, PermissionLevel, Emails});
// @ts-ignore
updatePermissions(PermissionName, PermissionLevel, Emails.split(','))
  .then(() => console.log('Permissions update completed'))
  .catch(error => console.error('Error updating permissions:', error));
