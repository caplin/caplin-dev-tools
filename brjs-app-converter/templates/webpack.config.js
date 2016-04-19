import {webpackConfigGenerator} from '@caplin/webpack-config-app';

const webpackConfig = webpackConfigGenerator({
	basePath: __dirname
});

export default webpackConfig;
