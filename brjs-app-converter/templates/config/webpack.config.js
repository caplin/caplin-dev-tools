import {resolve} from 'path';

import {webpackConfigGenerator} from '@caplin/webpack-config-app';

const webpackConfig = webpackConfigGenerator({
	basePath: resolve(__dirname, '..')
});

export default webpackConfig;
