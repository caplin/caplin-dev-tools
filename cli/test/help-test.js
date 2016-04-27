'use strict';
var execFile = require('child_process').execFile;
var assert = require('yeoman-assert');

describe('help', function () {
    it('should display the help content', function (isDisplayed) {
        var cp = execFile('node', ['./index.js', 'help']);
        var stdOutput;

        cp.stdout.on('data', function (data) {
            stdOutput += data;
             if(stdOutput.indexOf('Prints the current caplin-cli version') > -1) {
                 cp.stdout.destroy();
                 isDisplayed();
            }
        });
    });
});