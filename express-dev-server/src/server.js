import dotenv from 'dotenv';
import express from 'express';

import poll from './poll';
import webpackMiddleware from './webpack';

export default ({webpackConfig}) => {
	const app = express();
	const APP_PORT = 8080;
	const appRoot = process.cwd();

	// Load application environment variables from `.env` file, to inject into JNDI tokens.
	dotenv.config();

	// Serve static files (HTML, XML, CSS), contained in application directory.
	app.use(express.static(appRoot));

	poll(app);
	// Handlers/middleware for webpack.
	webpackMiddleware(app, webpackConfig);

	// Don't bind to `localhost` as that will mean the server won't be accessible by other machines on the LAN.
	app.listen(APP_PORT, (err) => console.log(err || `Listening on port ${APP_PORT}`)); // eslint-disable-line

	return app;
};
