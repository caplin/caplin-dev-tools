#! /usr/bin/env node
"use strict";

const parseArgs = require("minimist");

const { runTests } = require("./test-runner");

// `argv` consists of `a` -> Run only ATs.
//                    `b` -> "browser".
//                    `f` -> package name RegExp to filter out packages.
//                    `u` -> Run only UTs.
//                    `w` -> watch.
const minimistOpts = {
  boolean: ["a", "u", "w"],
  default: { b: "chrome" },
  string: ["b", "f"]
};
const argv = parseArgs(process.argv.slice(2), minimistOpts);

runTests(process.cwd(), argv);