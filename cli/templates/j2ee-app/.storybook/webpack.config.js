const path = require('path');
const { BASE_WEBPACK_CONFIG } = require("@caplin/webpack-config-app/config");
const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);

module.exports = webpackConfig;
