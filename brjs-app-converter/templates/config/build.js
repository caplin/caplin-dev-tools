import {cleanDistAndBuildWAR} from '@caplin/build-tasks';

import indexPage from '../server/index-page.js';
import webpackConfig from '../webpack.config.js';

cleanDistAndBuildWAR({indexPage, webpackConfig});
