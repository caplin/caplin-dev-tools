const notFound = require("@caplin/express-dev-server/not-found");
const server = require("@caplin/express-dev-server/server");

const createWebpackConfig = require("../../webpack.config");

server({ webpackConfig: createWebpackConfig() })
	.then(app => {
		// not-found has to be the last registered route handler.
		notFound(app);
	})
	.catch(error => console.log(error));
