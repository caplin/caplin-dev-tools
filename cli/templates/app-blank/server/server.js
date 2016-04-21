import notFound from '@caplin/express-dev-server/not-found';
import resources from '@caplin/express-dev-server/resources';
import server from '@caplin/express-dev-server/server';
import webpackConfig from '../webpack.config';

const app = server({webpackConfig});
const appRoot = process.cwd();
const applicationPath = '/{{appName}}';

resources(applicationPath, app, appRoot);
notFound(app);