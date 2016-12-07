import {
	exec
} from 'child_process';

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
				const descriptor = stdout === defaultBranchName ? null : stdout;
				resolve(descriptor);
			}
		);
	});
}

export default function createFullVersion(semVer, { hashLength = 8, masterBranchName = 'master' }) {
	return Promise
		.all([
			getCommitCount(),
			getHash(hashLength),
			getBranchDescriptor(defaultBranchName)
		])
		.then(
			(output) => new Promise(
				(resolve) => {
					const versionTokens = output.reduce(
						(acc, item) => {
							if (item !== null) {
								acc.push(item);
								return acc;
							}
						},
						[semVer]
					);

					resolve(versionTokens.join('-'));
				}
			)
		);
}
