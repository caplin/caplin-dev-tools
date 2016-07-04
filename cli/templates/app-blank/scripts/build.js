import getFullVersion from '@caplin/versioning';
import {cleanDistAndBuildWAR} from '@caplin/build-tasks';
import config from '../webpack.config';
import {readFileSync} from 'fs';
import {join} from 'path';

function buildCallback() {
	// add your own callback here
}

function getIndexPage() {
	return readFileSync(join(__dirname, '..', 'index.html'), 'utf8');
}

function versionCalculatedCallback(version) {
	cleanDistAndBuildWAR({
		buildCallback,
		indexPage: getIndexPage,
		version,
		warName: 'untitled',
		webpackConfig: config
	});
}

getFullVersion(process.env.npm_package_version)
	.then(versionCalculatedCallback)
	.catch(console.error);