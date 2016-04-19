/* eslint-disable no-console */

import {readFileSync} from 'fs';
import {join} from 'path';

import {
	hex2b64,
	Signature
} from 'jsrsasign';

let index = 0;
const privateKey = readFileSync(join(__dirname, './privatekey.pem'), 'utf8');
const SEPARATOR = '~';

export default (application) => {
	application.post('/servlet/StandardKeyMaster', keymasterHandler);
};

function keymasterHandler(req, res) {
	const customerId = req.query.customerId || 'ViewMode';
	const username = req.query.username || 'user1@caplin.com';

	if (req.query.type) {
		const authToken = getToken(username, customerId);

		res.send(`${authToken}\n`);
	} else {
		res
			.status(404)
			.send('');
	}
}

function getToken(username, customerId) {
	console.log(`Generating token for username [${username}] and customer id [${customerId}]`);

	const clearTextToken = generateClearTextToken(username, customerId);
	const signedToken = signToken(clearTextToken);

	console.log(`Token: ${clearTextToken}`);
	console.log(`Signed Token: ${signedToken}`);

	return getResponse(username, signedToken, clearTextToken);
}

function generateClearTextToken(username, customerId) {
	return getTimeStamp() +
		SEPARATOR +
		getIndex() +
		SEPARATOR +
		getExtraDataToSign() +
		SEPARATOR +
		getMappingData(customerId) +
		SEPARATOR +
		username;
}

function getTimeStamp() {
	const now = new Date();

	return String(now.getFullYear()) +
		format(now.getMonth() + 1) +
		format(now.getDate()) +
		format(now.getHours()) +
		format(now.getMinutes()) +
		format(now.getSeconds());
}

function format(value) {
	return String(value).length === 2 ? value : `0${value}`;
}

function getIndex() {
	return index++;
}

function getExtraDataToSign() {
	return '';
}

function getMappingData(customerId) {
	return `CustomerId=${customerId}`;
}

function signToken(clearTextToken) {
	const sig = new Signature({alg: 'SHA256withRSA'});

	sig.init(privateKey);
	sig.updateString(clearTextToken);

	return hex2b64(sig.sign());
}

function getResponse(username, signedToken, clearTextToken) {
	const credentials = 'credentials=ok\n';
	const usernameResponse = `username=${username}\n`;
	const token = `token=${signedToken + SEPARATOR + clearTextToken}`;

	return credentials + usernameResponse + token;
}
