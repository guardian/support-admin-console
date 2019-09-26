# Support Admin Console
Webapp for maintaining settings for the Guardian's Supporter platform.

Uses [play-googleauth](https://github.com/guardian/play-googleauth) for authorisation.

### Pages

- /switches - switchboard for contributions landing page
- /contribution-types - maintains contribution type settings on contributions landing page
- /amounts - maintains amounts settings on contributions landing page
- [/epic-tests](docs/epic-tests.md)

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
There are two types of controller for maintaining settings in S3:

`SettingsController`:

Provides `get` and `set` handlers for a single object in S3.

It prevents users from overwriting the object if they have an old version.
It returns the current version ID of the S3 object to the client, and requires the client to provide the latest version ID when updating it.

`LockableSettingsController`:

Also provides `get` and `set` handlers for a single object in S3, but also a mechanism for requiring users to 'lock' the object to prevent concurrent editing.

The lock status of the object is returned by `get`, containing the email address of the current owner and timestamp of the lock.
Updates are only permitted if the user has a lock.

A separate S3 object is used for recording the lock status.

Optionally sends a Fastly PURGE request after updates to S3.

