const {
  join
} = require("path");

const autoload = require("auto-load");

const commands = autoload(join(__dirname, "/commands"));

module.exports = Object.keys(commands).map(name => commands[name]).sort((
  a,
  b
) => {
  if (a.priority < b.priority) {
    return -1;
  }
  if (a.priority > b.priority) {
    return 1;
  }
  return 0;
});
