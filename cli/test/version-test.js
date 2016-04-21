'use strict';
var execFile = require('child_process').execFile;
var assert = require('yeoman-assert');
var pkg = require('../package.json');

describe('version', function () {
    it('should display version', function (isDisplayed) {
        var cp = execFile('node', ['./index.js', 'version']);

        cp.stdout.on('data', function (data) {
            var expected = pkg.version;
            assert.equal(data.replace(/\r\n|\n/g, ''), expected);
            isDisplayed();
        });
    });
});