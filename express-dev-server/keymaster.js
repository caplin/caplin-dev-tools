const { readFileSync } = require("fs");
const { join } = require("path");

const { hex2b64, Signature } = require("jsrsasign");

let defaultCustomerID;
let localTimezone;
let index = 0;
let privateKey;
const SEPARATOR = "~";
const MIN_IN_MILLISEC = 60000;

function format(value) {
  return String(value).length === 2 ? value : `0${value}`;
}

function getTimeStamp() {
  let now = new Date();
  // For non UK dev servers, this adjusts the timestamp when
  // running against a backend server hosted in the UK
  if (!localTimezone) {
    const serverTime =
      now.getTime() +
      now.getTimezoneOffset() * MIN_IN_MILLISEC;
    now = new Date(serverTime);
  }

  return (
    String(now.getFullYear()) +
    format(now.getMonth() + 1) +
    format(now.getDate()) +
    format(now.getHours()) +
    format(now.getMinutes()) +
    format(now.getSeconds())
  );
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
  console.log(
    `Generating token for username [${username}] and customer ID [${customerId}]`
  );

  const clearTextToken = generateClearTextToken(username, customerId);
  const signedToken = signToken(clearTextToken);

  console.log(`Token: ${clearTextToken}`);
  console.log(`Signed Token: ${signedToken}`);

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
  { keyDirectory, customerID = "", defaultLocalTimezone = true }
) => {
  defaultCustomerID = customerID;
  localTimezone = defaultLocalTimezone;
  privateKey = readFileSync(join(keyDirectory, "privatekey.pem"), "utf8");
  application.post("/servlet/StandardKeyMaster", keymasterHandler);
};
