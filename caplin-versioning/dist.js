'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _nodegit = require('nodegit');

var _nodegit2 = _interopRequireDefault(_nodegit);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHeadCommit() {
	return _nodegit2.default.Repository.open(process.cwd()).then(function (repo) {
		return repo.getHeadCommit();
	});
}

function getHash() {
	return getHeadCommit().then(function (commit) {
		return commit.sha();
	});
}

function getCommitCount() {
	return new Promise(function (resolve, reject) {
		(0, _child_process.exec)("git rev-list --count HEAD", function (error, stdout, stderr) {
			resolve(stdout);
		});
	});
}

function createFullVersion(semVer) {
	return Promise.all([getCommitCount(), getHash()]).then(function (output) {
		return new Promise(function (resolve, reject) {
			resolve(semVer + '-' + output[0].trim() + '-' + output[1].substr(0, 8));
		});
	});
}

exports.default = createFullVersion;

// Example usage
// createFullVersion('1.0.0').then(version => console.log(version))

