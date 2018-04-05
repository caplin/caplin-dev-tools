const chalk = require("chalk");
const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, label, message, timestamp }) => {
  let colour = () => {};
  const formattedLevel = level.toUpperCase();
  const middle = ` [${label}] ${timestamp}: `;

  if (level === "warn") {
    colour = chalk.bgYellow;
  } else if (level === "error") {
    colour = chalk.bgRed;
  }

  return `${colour(formattedLevel)}${middle}${colour(message)}`;
});

const logger = createLogger({
  level: "warn",
  format: combine(timestamp({ format: "hh:mm:ss" }), customFormat),
  transports: [new transports.Console()]
});

module.exports = logger;
