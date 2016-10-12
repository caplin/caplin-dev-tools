import {
	exec
} from 'child_process';

function getHash() {
	return new Promise((resolve) => {
		exec(
			'git rev-parse HEAD',
			(error, stdout) => {
				resolve(stdout);
			}
		);
	});
}

function getCommitCount() {
	return new Promise((resolve) => {
		exec(
			'git rev-list --count HEAD',
			(error, stdout) => {
				resolve(stdout);
			}
		);
	});
}

export default function createFullVersion(semVer, hashLength = 8) {
	return Promise
		.all([
			getCommitCount(),
			getHash()
		])
		.then((output) => new Promise((resolve) => {
			const commitCount = output[0].trim();
			const gitHash = output[1].trim().substr(0, hashLength);
			const version = `${semVer}-${commitCount}-${gitHash}`;

			resolve(version);
		}));
}
