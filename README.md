# Support Admin Console

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
