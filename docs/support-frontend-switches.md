### support-frontend switches

This app has a switchboard (at /switches) for enabling/disabling features on support.theguardian.com (support-frontend).

The switches live in the support-admin-console S3 bucket, in `switches_v2.json`.

The switchboard displays whatever switches are in the json file, and the support-admin-console [model](app/models/SupportFrontendSwitches.scala) does not have knowledge of individual switches.

To add a new switch:
1. Manually add it to the `switches_v2.json` json file
2. Add it to the [model in support-frontend](https://github.com/guardian/support-frontend/blob/main/support-frontend/app/admin/settings/Switches.scala).
