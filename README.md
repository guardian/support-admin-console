# Support Admin Console
Webapp for maintaining settings for the Guardian's Supporter platform and acquisition channels.

Uses [play-googleauth](https://github.com/guardian/play-googleauth) for authorisation.

### Pages

#### For support.theguardian.com:
- /switches - switchboard for contributions landing page
- /contribution-types - maintains contribution type settings on contributions landing page
- /amounts - maintains amounts settings on contributions landing page

####For theguardian.com channel tests ([see here for details](docs/channel-tests.md)):
- /epic-tests
- /liveblog-epic-tests
- /banner-tests and /banner-tests2
- /banner-deploy

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
You must ssh via the bastion, e.g. using [ssm-scala](https://github.com/guardian/ssm-scala):

`ssm ssh --profile membership --bastion-tags contributions-store-bastion,support,PROD --tags admin-console,support,CODE -a -x --newest`


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

### How to add a new switch
This section will describe how to add a simple on/off switch to the switchboard for a PR example of this [see here](https://github.com/guardian/support-admin-console/pull/157/files)

- Add your new switch to the `SupportFrontendSwitches` class in _SupportFrontendSwitches.scala_ make sure to provide a default value for the new switch
as this will be used when loading values from S3 for the first time. Eg:
```
case class SupportFrontendSwitches(
  ...
  myNewSwitch: SwitchState = Off
)
```
- Add the new switch into the `Switches` interface in _switchboard.tsx_
- Set a default value for your new switch in the constructor of the `Switchboard` component in _switchboard.tsx_
- Add a user interface component to control the state of your switch in _switchboard.tsx_
- Update _S3JsonSpec.scala_ to add the new switch to both the `expectedJson` string and the `expectedDecoded` object

Your new switch should now be ready to use

