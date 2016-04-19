/* eslint-disable camelcase */

import {join} from 'path';

const userPostResponse = {
	code: 0,
	next_step: '2fa',
	result: 'success'
};

const parameters = {
	encryption_algorithm: 'RSA',
	encryption_key: '',
	'2fa_schemes': ['sms', 'token']
};

function parametersHandler(req, res) {
	res.json(parameters);
}

function jsServletGetHandler(req, res) {
	res.sendFile(join(__dirname, 'JavaScriptServlet.js'));
}

function jsServletPostHandler(req, res) {
	res.send('');
}

function authenticateUserPostHandler(req, res) {
	res.json(userPostResponse);
}

export default (applicationPath, application) => {
	application.post('/parameters', parametersHandler);
	application.get('/JavaScriptServlet', jsServletGetHandler);
	application.post(`${applicationPath}/JavaScriptServlet`, jsServletPostHandler);
	application.post('/authenticate/user', authenticateUserPostHandler);
};
