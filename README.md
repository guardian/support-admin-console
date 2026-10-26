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

#### Automatic rotation in CODE

The CDK stack creates a CODE-only Java 21 Lambda triggered daily by EventBridge, using Guardian's published `aws-parameterstore-lambda_2.13` JAR pinned to `21.0.1`. Regular app builds and Riff-Raff deployments do not download, bundle, or upload this JAR. CloudFormation references the existing artifact at `s3://membership-dist/support/CODE/admin-console/play-secret-rotation/21.0.1/aws-parameterstore-lambda.jar`.

The selected `21.0.1` artifact has reported vulnerabilities. Do not upload it for deployment or deploy this automation until a patched release is available or its use has been approved through security review. Manual Parameter Store rotation remains available while automation is pending. The current CDK configuration enables the daily schedule by default on deployment.

Once the artifact is approved, upload it manually before deploying the CODE stack:

1. Download the approved `aws-parameterstore-lambda_2.13` JAR from [Maven Central](https://central.sonatype.com/artifact/com.gu.play-secret-rotation/aws-parameterstore-lambda_2.13), checking the exact release version and its security findings.
2. Using existing AWS credentials with `s3:PutObject` permission for the artifact path, open S3 in `eu-west-1` and select `membership-dist`.
3. Upload the JAR to `support/CODE/admin-console/play-secret-rotation/<approved-version>/aws-parameterstore-lambda.jar`, renaming the downloaded file to `aws-parameterstore-lambda.jar` and keeping it private. Do not overwrite an existing release object.
4. Ensure the versioned S3 key in the CDK stack and its test matches the uploaded version before deploying. If using a patched release instead of `21.0.1`, update those references and this documentation first.

No new GitHub Actions role or repository secret is required for manual upload, provided the existing AWS role has the necessary S3 permission. Uploading the JAR alone does not deploy or invoke the Lambda. Repeat the upload process only when upgrading to another approved release, before deploying the corresponding CDK change.

The handler is `com.gu.play.secretrotation.aws.parameterstore.Lambda::lambdaHandler`. It generates a new secret and overwrites `/admin-console/CODE/play.http.secret.key`, preserving its SecureString type and KMS key. PROD has no rotation Lambda or schedule. Deploy the rotation-enabled Play app before deploying this automation; a Lambda test invocation performs a real rotation.

The published handler has no cooldown or duplicate-event protection and uses the AWS SDK's default retry behavior. Concurrent invocations are limited to one, and automatic retries are disabled in EventBridge and Lambda. Avoid additional rotations within 2 hours 3 minutes of an update: another version can remove a still-needed secret from the latest two versions. Pause the schedule before a manual rotation or replay. Only the target parameter can be updated; `ssm:DescribeParameters` requires account-wide resource scope.

Failures are sent to an SQS failure queue retained for 14 days. CloudWatch alarms cover Lambda errors and visible messages in that queue; notification subscriptions are not configured by this stack. Inspect logs and parameter version metadata before manually replaying a failed event. Disable the `DailyPlaySecretRotation` EventBridge rule in CODE before rolling back to an app without rotation support or pausing scheduled updates. Re-enable it after the rotation-enabled app is healthy.

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
