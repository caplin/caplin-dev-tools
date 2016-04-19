import notFound from '@caplin/express-dev-server/not-found';
import resources from '@caplin/express-dev-server/resources';
import server from '@caplin/express-dev-server/server';

import authentication from './authentication';
import indexPage from './index-page';
import keymaster from './keymaster';
import webpackConfig from '../webpack.config';

const app = server({webpackConfig});
const applicationPath = '/mobile';
const appRoot = process.cwd();

app.get('/', (req, res) => res.send(indexPage()));

// Resources served from `node_modules` packages.
resources(applicationPath, app, appRoot);

// Handlers/middleware for authentication.
authentication(applicationPath, app);
keymaster(app);

// Has to be the last registered route handler.
notFound(app);
