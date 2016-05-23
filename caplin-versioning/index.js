import Git from 'nodegit';
import { exec } from 'child_process';

function getHeadCommit() {
	return Git.Repository
		.open(process.cwd())
		.then(repo => repo.getHeadCommit());
}

function getHash() {
	return getHeadCommit().then(commit => commit.sha());	
}

function getCommitCount() {
	return new Promise((resolve, reject) => {
		exec("git rev-list --count HEAD", function (error, stdout, stderr) {
			resolve(stdout);
		});
	})
}

function createFullVersion(semVer) {
	return Promise.all([getCommitCount(), getHash()])
		.then(output => new Promise((resolve, reject) => {
			resolve(`${ semVer }-${ output[0].trim() }-${ output[1].substr(0, 8) }`);
		}));
}

export default createFullVersion;

// Example usage
// createFullVersion('1.0.0').then(version => console.log(version))