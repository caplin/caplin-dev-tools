"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _child_process = require("child_process");

function getHeadCommit() {
	return Git.Repository.open(process.cwd()).then(repo => repo.getHeadCommit());
}

function getHash() {
	return new Promise((resolve, reject) => {
		(0, _child_process.exec)("git rev-parse HEAD", function (error, stdout, stderr) {
			resolve(stdout);
		});
	});
}

function getCommitCount() {
	return new Promise((resolve, reject) => {
		(0, _child_process.exec)("git rev-list --count HEAD", function (error, stdout, stderr) {
			resolve(stdout);
		});
	});
}

function createFullVersion(semVer) {
	return Promise.all([getCommitCount(), getHash()]).then(output => new Promise((resolve, reject) => {
		resolve(`${ semVer }-${ output[0].trim() }-${ output[1].trim().substr(0, 8) }`);
	}));
}

exports.default = createFullVersion;

// Example usage
// createFullVersion('1.0.0').then(version => console.log(version))

