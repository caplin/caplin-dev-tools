'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createFullVersion;

var _child_process = require('child_process');

function getHash() {
	return new Promise(resolve => {
		(0, _child_process.exec)('git rev-parse HEAD', (error, stdout) => {
			resolve(stdout);
		});
	});
}

function getCommitCount() {
	return new Promise(resolve => {
		(0, _child_process.exec)('git rev-list --count HEAD', (error, stdout) => {
			resolve(stdout);
		});
	});
}

function createFullVersion(semVer) {
	return Promise.all([getCommitCount(), getHash()]).then(output => new Promise(resolve => {
		const commitCount = output[0].trim();
		const gitHash = output[1].trim().substr(0, 8);
		const version = `${ semVer }-${ commitCount }-${ gitHash }`;

		resolve(version);
	}));
}

