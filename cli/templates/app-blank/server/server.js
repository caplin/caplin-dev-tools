import notFound from '@caplin/express-dev-server/not-found';
import resources from '@caplin/express-dev-server/resources';
import server from '@caplin/express-dev-server/server';

import createWebpackConfig from '../webpack.config';

const app = server({
	webpackConfig: createWebpackConfig()
});
const applicationPath = '/{{appName}}';
const appRoot = process.cwd();

// Resources served from `node_modules` packages.
resources(applicationPath, app, appRoot);

// Has to be the last registered route handler.
notFound(app);