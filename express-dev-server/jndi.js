const dotenv = require("dotenv");

// Load application environment variables from `.env` file, to inject into
// JNDI tokens.
dotenv.config();

function jndiTokenReplacer(match, jndiToken) {
  if (process.env[jndiToken]) {
    return process.env[jndiToken];
  }

  console.warn(`A value for JNDI token ${jndiToken} could not be found.`);

  return match;
}

module.exports = function injectJNDITokens(indexPage) {
  return indexPage.replace(/@([A-Z|.]+)@/g, jndiTokenReplacer);
};
