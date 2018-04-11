const { readFileSync } = require("fs");
const { join } = require("path");
const logger = require("@caplin/node-logger");
const { hex2b64, Signature } = require("jsrsasign");
const moment = require("moment-timezone");

let defaultCustomerID;
let index = 0;
let privateKey;
let timestampTimezone;
const SEPARATOR = "~";

function getTimeStamp() {
  let now = moment();

  // Adjust the timestamp if the back end is located in a different timezone.
  if (timestampTimezone) {
    now = now.tz(timestampTimezone);
  }

  return now.format("YYYYMMDDHHmmss");
}

function getExtraDataToSign() {
  return "";
}

function getMappingData(customerId) {
  return `CustomerId=${customerId}`;
}

function generateClearTextToken(username, customerId) {
  const timestamp = getTimeStamp();

  index += 1;

  return (
    timestamp +
    SEPARATOR +
    index +
    SEPARATOR +
    getExtraDataToSign() +
    SEPARATOR +
    getMappingData(customerId) +
    SEPARATOR +
    username
  );
}

function signToken(clearTextToken) {
  const sig = new Signature({ alg: "SHA256withRSA" });

  sig.init(privateKey);
  sig.updateString(clearTextToken);

  return hex2b64(sig.sign());
}

function getResponse(username, signedToken, clearTextToken) {
  const credentials = "credentials=ok\n";
  const usernameResponse = `username=${username}\n`;
  const token = `token=${signedToken + SEPARATOR + clearTextToken}`;

  return credentials + usernameResponse + token;
}

function getToken(username, customerId) {
  const clearTextToken = generateClearTextToken(username, customerId);
  const signedToken = signToken(clearTextToken);

  logger.log({
    label: "express-dev-server/keymaster",
    level: "verbose",
    message: `Token for ${username} [${clearTextToken}] [${signedToken}] and customer ID [${customerId}]`
  });

  return getResponse(username, signedToken, clearTextToken);
}

function keymasterHandler(req, res) {
  const customerId = req.query.customerId || defaultCustomerID;
  const username = req.query.username || "user1@caplin.com";

  if (req.query.type) {
    const authToken = getToken(username, customerId);

    res.send(`${authToken}\n`);
  } else {
    res.status(404).send("");
  }
}

module.exports = (
  application,
  { keyDirectory, customerID = "", serverTimezone }
) => {
  defaultCustomerID = customerID;
  timestampTimezone = serverTimezone;
  privateKey = readFileSync(join(keyDirectory, "privatekey.pem"), "utf8");
  application.post("/servlet/StandardKeyMaster", keymasterHandler);
};
