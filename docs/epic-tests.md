### Epic Tests tool (/epic-tests)

This page is for configuring the epic test rules, which are used by theguardian.com to decide which epic to display to users.

Users' browsers request the rules from support.theguardian.com/epic-tests.json. This file is served by Fastly, and the origin is in the gu-contributions-public S3 bucket.

##### Caching
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
