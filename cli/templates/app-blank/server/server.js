import {join} from 'path';
import express from 'express';
import webpackMiddleware from './webpack';

const app = express();
const APP_PORT = 8080;
const appRoot = join(__dirname, '..');

// Serve static files (HTML, XML, CSS), contained in application directory.
app.use(express.static(appRoot));

// Handlers/middleware for webpack.
webpackMiddleware(app);

// Don't bind to `localhost` as that will mean the server won't be accessible by other machines on the LAN.
app.listen(APP_PORT, (err) => console.log(err || `Listening on port ${APP_PORT}`)); // eslint-disable-line