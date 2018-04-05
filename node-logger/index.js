const { red, yellow } = require("chalk");
const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf } = format;
const NO_COLOUR = () => {};

function getColour(level) {
  if (level === "warn") {
    return yellow;
  } else if (level === "error") {
    return red;
  }

  return NO_COLOUR;
}

function getMessage(level, message) {
  if (level === "error") {
    return message.stack;
  }

  return message;
}

const customFormat = printf(({ level, label, message, timestamp }) => {
  const colour = getColour(level);
  const formattedLevel = colour(level.toUpperCase());
  const formattedMessage = colour(getMessage(level, message));
  const middle = ` [${label}] ${timestamp}: `;

  return `${formattedLevel}${middle}${formattedMessage}`;
});

const logger = createLogger({
  level: "warn",
  format: combine(timestamp({ format: "hh:mm:ss" }), customFormat),
  transports: [new transports.Console()]
});

module.exports = logger;
