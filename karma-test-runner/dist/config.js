"use strict";

const { resolve } = require("path");

const atsTestEntry = resolve(__dirname, "entries", "ats-test-entry.js");

module.exports.atsTestEntry = atsTestEntry;

const utsTestEntry = resolve(__dirname, "entries", "uts-test-entry.js");

module.exports.utsTestEntry = utsTestEntry;