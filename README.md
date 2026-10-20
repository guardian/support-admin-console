# Support Admin Console
Webapp for maintaining settings for the Guardian's Supporter platform and acquisition channels.

Uses [play-googleauth](https://github.com/guardian/play-googleauth) for authorisation.

### Pages

#### For support.theguardian.com:
- /switches - [switchboard for contributions landing page](/docs/support-frontend-switches.md)
- /contribution-types - maintains contribution type settings on contributions landing page

#### For theguardian.com channel tests ([see here for details](docs/channel-tests.md)):
- tools for channel test configuration (epic, banner, header)
- /banner-deploy - for manually redeploying the banners
- /campaigns - for managing groups of channel tests in a "campaign"

### Developing + running locally

It is best practice to develop and run using a devcontainer. For this we use the Guardian's [devenv](https://github.com/guardian/devenv#devenv) tool.

Whether using a devcontainer or not, open a terminal and follow these steps:
1. get `Local Development` AWS credentials for the `membership` account (from Janus) and paste into the terminal
2. run `./devrun.sh`, a script to build and run both client + server (and watch for changes)
3. visit http://localhost:9000 in your browser

The required Node and Java versions are specified in the `.tool-versions` file in the root of the project. We recommend [Mise](https://mise.jdx.dev/getting-started.html) for this. A devcontainer will take care of this automatically.

The server will use local config if available (at `/etc/gu/support-admin-console.private.conf`), otherwise it will fall back on CODE config from AWS Parameter Store. If you want to use local config then you can download the example DEV config file with `./fetch-dev-config.sh`.

### Play application secret rotation

The Play application secret is rotated using the `play.http.secret.key` SecureString in AWS Systems Manager Parameter Store. The app reads the current and previous parameter versions and transitions between them; no rotation Lambda is required for a manual rotation.

To rotate a stage manually, open Parameter Store in `eu-west-1` and edit the existing parameter:

- CODE: `/admin-console/CODE/play.http.secret.key`
- PROD: `/admin-console/PROD/play.http.secret.key`

Keep the parameter type as `SecureString` and its KMS key as `alias/aws/ssm`. Replace the value and save it as a new parameter version; do not delete and recreate the parameter. Generate a value with `openssl rand -hex 32` (64 hexadecimal characters). Only perform this after the rotation-enabled app has been deployed to that stage.

The app is configured with a 3-minute usage delay and a 2-hour overlap. After a value is published, the app starts using it after the delay and continues accepting the previous value during the overlap. For an emergency rotation, publish the replacement immediately using the same procedure, but be aware that this does not immediately invalidate a compromised secret. Immediate revocation would require changing the transition behavior and can invalidate active sessions and in-flight authentication/CSRF requests.

To roll back, retrieve the known-good value from Parameter Store history and save it as a new version of the same parameter. The app will transition back using the same delay and overlap.

### Running Playwright E2E tests (awailable only locally)

The full E2E suite reads and writes settings in S3. Before running it, obtain admin AWS credentials for the membership account from Janus with permission to read and write the S3 objects used by the app. Credentials without these permissions can cause tests to fail even when local authentication succeeds.

Install the Chromium browser once:
```
pnpm exec playwright install chromium
```

#### Set up local authentication

Playwright loads the saved authentication state configured in `playwright.config.ts`. Create it by starting the app with `./devrun.sh` (requires the local DEV config and AWS credentials), then running this command in another terminal:
```
pnpm test:e2e:auth-setup
```

The command opens a visible Chromium window for Google sign-in, validates the session, and saves browser storage to `e2e/.auth/local.json`. This file is local and gitignored. You only need to run setup once while the saved session remains valid; rerun it if the session expires or becomes invalid, the file is removed, or you change the target app origin. Use the same `PLAYWRIGHT_BASE_URL` for setup and tests.

Once authentication is set up, start the app with `./devrun.sh` and run the E2E tests in another terminal:
```
pnpm test:e2e
```

By default tests target `http://localhost:9000`. Set `PLAYWRIGHT_BASE_URL` to test another running instance.

### Running scala tests
The scala backend tests use dynamodb-local. This doesn't support Apple Silicon (M1).

If while running `sbt test` you get the error `cannot load library: java.lang.UnsatisfiedLinkError: no sqlite4java-osx-aarch64`, use this work around:
1. download the correct `.dylib` from e.g. https://repo1.maven.org/maven2/io/github/ganadist/sqlite4java/libsqlite4java-osx-arm64/1.0.392/libsqlite4java-osx-arm64-1.0.392.dylib
2. copy it into the `dynamodb-local/DynamoDBLocal_lib/` directory in this project

We use [scalafmt](https://scalameta.org/scalafmt/) for consistent formatting of scala code. The tests will check that any changed files have correct formatting.

To fix formatting issues run:

`sbt scalafmt`

### SSH
You can ssh using [ssm-scala](https://github.com/guardian/ssm-scala):

`ssm ssh --profile membership --ssm-tunnel --tags admin-console,support,CODE -a -x --newest`


### CDK
The cloudformation stacks are managed by [cdk](https://github.com/guardian/cdk).

The stack is defined in [admin-console.ts](cdk/lib/admin-console.ts).

When you make a change to the stack you must update the snapshot by going to the cdk directory and running:

`pnpm test-update`

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

### Permissions
Some tools require permissions, in addition to membership of the Google group.

Permissions are stored in a DynamoDb table, `support-admin-console-permissions-${Stage}` and an Access Management screen is provided to allow updates in the UI.
