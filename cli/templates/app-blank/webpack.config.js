import {
	configureAliases
} from '@caplin/alias-loader/alias-configuration';
import {
	webpackConfigGenerator
} from '@caplin/webpack-config-app';

import aliases from './src/config/aliases';
import testAliases from './src/config/aliases-test';

const webpackAppAliases = {	
};

export default function createWebpackConfig(version) {
	const webpackConfig = webpackConfigGenerator({
		basePath: __dirname
	});

	configureAliases(aliases, webpackConfig, testAliases, webpackAppAliases);

	return webpackConfig;
}
