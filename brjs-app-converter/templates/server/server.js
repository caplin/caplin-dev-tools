import {join} from 'path';

import express from 'express';

import authentication from './authentication';
import indexPage from './index-page';
import keymaster from './keymaster';
import notFound from './not-found';
import resources from './resources';
import webpackMiddleware from './webpack';

const app = express();
const APP_PORT = 8080;
const appRoot = join(__dirname, '..');
const applicationPath = '/mobile';

app.get('/', (req, res) => res.send(indexPage()));

// Handlers for serving static files.

// Serve static files (HTML, XML, CSS), contained in application directory.
app.use(express.static(appRoot));
// Resources that can be served from `node_modules`/application packages.
resources(applicationPath, app, appRoot);

// Handlers/middleware for authentication and webpack.

authentication(applicationPath, app);
keymaster(app);
webpackMiddleware(app);

// Has to be the last registered route handler.
notFound(app);

// Don't bind to `localhost` as that will mean the server won't be accessible by other machines on the LAN.
app.listen(APP_PORT, (err) => console.log(err || `Listening on port ${APP_PORT}`)); // eslint-disable-line
