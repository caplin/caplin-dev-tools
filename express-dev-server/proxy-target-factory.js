const {spawn} = require('child_process');

module.exports = ({cmd = 'mvn', args = ['-f', 'server/proxy-target-FXPro', 'jetty:run']} = {}) => {
	// {shell: true} is required for Windows.
	const proxyTarget = spawn(cmd, args, {shell: true});

	proxyTarget.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`); //eslint-disable-line
	});

	proxyTarget.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`); //eslint-disable-line
	});

	proxyTarget.on('close', (code) => {
		console.log(`child process exited with code ${code}`); //eslint-disable-line
	});

	return proxyTarget;
};
