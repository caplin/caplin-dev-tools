import {
	spawn
} from 'child_process';

export default ({cmd = 'mvn', args = ['-f', 'server/proxy-target-FXPro', 'jetty:run']}) => {
	const proxyTarget = spawn(cmd, args);

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
