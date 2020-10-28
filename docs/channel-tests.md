### Channel tests
This app provides tools for configuring the epic and banner acquisition channels.

Test architecture overview diagram:
https://docs.google.com/drawings/d/1QjcleJ00a0n4yfqz2vbjxBqaR_QIJEIhsLL4XmloZdQ/edit

Each test editor in this app maintains a json file in S3 containing an array of tests.
These json files are polled by [support-dotcom-components](https://github.com/guardian/support-dotcom-components) and used to decide which test/variant a user should see.

We have the following test tools:

#### /epic-tests
Configures the standard epic displayed at the bottom of an article.
 

#### /banner-tests and /banner-tests2 
Configures the two banner channels.
Historically channel 1 was for contributions banners, and channel 2 for subscriptions banners.
But now any type of banner can appear in either channel.

A channel 2 banner will not be displayed until a channel 1 banner has been dismissed.
The client maintains a 'last closed at' timestamp in local storage for each banner channel to keep track of this.

#### /banner-deploy
Tool for redeploying each of the 2 banner channels, per region.
The client's 'last closed at' timestamp is compared against the redeploy timestamp to determine whether to display a banner.

#### /liveblog-epic-tests
Configures the liveblog epic.

Note - this is the only channel that is still rendered 'natively' by frontend, rather than served by support-dotcom-components.

Whilst this is still the case, the client has to fetch the tests json file directly. This file is served by Fastly, and the origin is in the gu-contributions-public S3 bucket.

_Caching of liveblog-epic-tests.json_

(This can go away once we've migrated frontend to fetch liveblog epics from support-dotcom-components.)  

When the server writes to S3 it sets two cache headers:
- cache-control, a short max-age for browsers
- surrogate-control, a much longer max-age (24 hours) to be used by Fastly

This means requests to S3 are very infrequent.
When a user of the epic tests tool clicks 'Save', the backend sends a PURGE request to Fastly, and changes should be reflected in theguardian.com almost immediately.

```
                                     +--------+
+---------------+  PUT  +----+  GET  |        |
|               +-------> S3 <-------+        |
|               |       +----+       |        | GET
| admin-console |                    | Fastly <----+theguardian.com
|               +-------------------->        |
|               |       PURGE        |        |
+---------------+                    |        |
                                     +--------+
```
