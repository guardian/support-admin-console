# Support Admin Console
Webapp for maintaining settings for the Guardian's Supporter platform and acquisition channels.

Uses [play-googleauth](https://github.com/guardian/play-googleauth) for authorisation.

### Pages

#### For support.theguardian.com:
- /switches - [switchboard for contributions landing page](/docs/support-frontend-switches.md)
- /contribution-types - maintains contribution type settings on contributions landing page
- /amounts - maintains amounts settings on contributions landing page

#### For theguardian.com channel tests ([see here for details](docs/channel-tests.md)):
- tools for channel test configuration (epic, banner, header)
- /banner-deploy - for manually redeploying the banners
- /campaigns - for managing groups of channel tests in a "campaign"

### Running locally
Fetch DEV config by getting `membership` janus credentials and running:
`./fetch-config.sh`

Build the client:
```
npm install
npm run build-dev
```

Run the play server:
```
sbt run
```

Refresh automatically:
```
npm run watch
```

### SSH
You can ssh using [ssm-scala](https://github.com/guardian/ssm-scala):

`ssm ssh --profile membership --ssm-tunnel --tags admin-console,support,CODE -a -x --newest`


### CDK
The cloudformation stacks are managed by [cdk](https://github.com/guardian/cdk).

The stack is defined in [admin-console.ts](cdk/lib/admin-console.ts).

When you make a change to the stack you must update the snapshot by going to the cdk directory and running:

`yarn test -u`

Riffraff will make the cloudformation changes during the deploy.

### Backend
There are three types of abstract controller for managing objects in S3:

#### `S3ObjectController`

Provides `get` and `set` handlers for a single object in S3.

It prevents users from overwriting the object if they have an old version.
It returns the current version ID of the S3 object to the client, and requires the client to provide the latest version ID when updating it.

#### `S3ObjectsController`

Provides `get`, `set` and `list` handlers for many S3 objects under a specific path. Also requires a version ID for updates.

#### `LockableS3ObjectController`

Provides `get` and `set` handlers for a single object in S3, but also a mechanism for requiring users to 'lock' the object to prevent concurrent editing.

The lock status of the object is returned by `get`, containing the email address of the current owner and timestamp of the lock.
Updates are only permitted if the user has a lock.

A separate S3 object is used for recording the lock status.

Optionally sends a Fastly PURGE request after updates to S3.
