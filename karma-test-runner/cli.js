#! /usr/bin/env node

const parseArgs = require("minimist");

const { runTests } = require("./test-runner");

// `argv` consists of `a` -> Run only ATs.
//                    `b` -> "browser".
//                    `f` -> package name RegExp to filter out packages.
//                    `u` -> Run only UTs.
//                    `w` -> watch.
//                    `h` -> Enable HTML reporting.
const minimistOpts = {
  boolean: ["a", "u", "w", "h", "c"],
  default: { b: "chrome" },
  string: ["b", "f"]
};
const argv = parseArgs(process.argv.slice(2), minimistOpts);

runTests(process.cwd(), argv);
