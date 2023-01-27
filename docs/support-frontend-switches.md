### support-frontend switches

This app has a switchboard (at /switches) for enabling/disabling features on support.theguardian.com (support-frontend).

The switches live in the support-admin-console S3 bucket, in `switches_v2.json`. Be careful not to copy `switches_v2.json` between Code, Dev, and Prod because their settings may differ. Before uploading your changed version, consider downloading the current file and diffing it with your changed file, to make sure you only see the changes you expect.

The switchboard displays whatever switches are in the json file, and the support-admin-console [model](app/models/SupportFrontendSwitches.scala) does not have knowledge of individual switches.

To add/remove a new switch:

1. Manually add/remove it to the `switches_v2.json` json file
2. Add it to (or remove it from) the [model in support-frontend](https://github.com/guardian/support-frontend/blob/main/support-frontend/app/admin/settings/Switches.scala).
