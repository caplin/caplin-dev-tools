/* eslint-disable no-process-env */

import dotenv from 'dotenv';
import express from 'express';

import poll from './poll';
import webpackMiddleware from './webpack';

export default ({webpackConfig}) => {
	const app = express();
	const appRoot = process.cwd();

	// Load application environment variables from `.env` file, to inject into JNDI tokens.
	dotenv.config();

	// Serve static files (HTML, XML, CSS), contained in application directory.
	app.use(express.static(appRoot));

	poll(app);
	// Handlers/middleware for webpack.
	webpackMiddleware(app, webpackConfig);

	const APP_PORT = process.env.PORT || 8080;

	// Don't bind to `localhost` as that will mean the server won't be accessible by other machines on the LAN.
	app.listen(APP_PORT, (err) => console.log(err || `Listening on port ${APP_PORT}`)); // eslint-disable-line

	return app;
};
