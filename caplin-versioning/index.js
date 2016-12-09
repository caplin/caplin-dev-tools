const exec = require('child_process').exec;

function getHash(hashLength) {
	return new Promise((resolve) => {
		exec(
			'git rev-parse HEAD',
			(error, stdout) => {
				const hash = stdout.trim().substr(0, hashLength)
				resolve(hash);
			}
		);
	});
}

function getCommitCount() {
	return new Promise((resolve) => {
		exec(
			'git rev-list --count HEAD',
			(error, stdout) => {
				const count = stdout.trim();
				resolve(count);
			}
		);
	});
}

function getBranchDescriptor(defaultBranchName) {
	return new Promise((resolve) => {
		exec(
			'git rev-parse --abbrev-ref HEAD',
			(error, stdout) => {
				const currentBranch = stdout.trim();
				const descriptor = currentBranch === defaultBranchName ? null : currentBranch;

				resolve(descriptor);
			}
		);
	});
}

module.exports = function createFullVersion(semVer, { hashLength = 8, masterBranchName = 'master' }) {
	return Promise
		.all([
			getCommitCount(),
			getHash(hashLength),
			getBranchDescriptor(masterBranchName)
		])
		.then(
			(output) => output.reduce(
				(acc, item) => {
					if (item !== null) {
						acc.push(item);
					}

					return acc;
				},
				[semVer]
			).join('-')
		);
}
