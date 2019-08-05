const logger = require("@caplin/node-logger");
const dotenv = require("dotenv");

// Load application environment variables from `.env` file, to inject into
// JNDI tokens.
dotenv.config();

function jndiTokenReplacer(match, jndiToken) {
  if (process.env.hasOwnProperty(jndiToken)) {
    return process.env[jndiToken];
  }

  logger.log({
    label: "express-dev-server/jndi",
    level: "warn",
    message: `JNDI token ${jndiToken} value could not be found.`
  });

  return match;
}

module.exports = function injectJNDITokens(indexPage) {
  return indexPage.replace(/@([A-Za-z|.]+)@/g, jndiTokenReplacer);
};
