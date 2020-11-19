This project represents minimal Aflon application. Download this project on your development machine and then tailor it to your needs to bootstrap Aflon project.

### Modify package.json

Suplay package.json with relevant information, in particular be sure to update ```name```, ```version```, ```description``` fields as well to specify at least ```author``` and ```license``` fields.

Sample project only depends on Aflon. Make sure to update Aflon version to the latest.

Apart from Aflon, sample project depends on several dev dependencies: webpack, typescript and local-web-server. Any other stack can be used. Make sure to update version of dev dependencies as well.

### Commands

package.json contains 3 commands:

**build** - builds sample app;
**start** - starts web-server which serves ./dist directory for viewing project;
**start-studio** - starts web-server which serves ./dist_test directory for using Aflon Studio.

To start the application, run:

```
npm run build
npm run start
```

and then navigate to localhost:9000 in your browser. Aflon Studio can be previewed at localhost:9090 once it is started.