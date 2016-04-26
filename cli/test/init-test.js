'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var assert = require('yeoman-assert');

describe('init', function () {
    it('should display an error when running in non empty directory', function (isDisplayed) {
        var cp = execFile('node', ['./index.js', 'init']);
        var expected = "needs to be run in an empty directory";

        cp.stdout.on('data', function (data) {
            if(data.indexOf(expected) > -1) {
                isDisplayed();
            }
        });
    });

    it('should initialise the workspace', function () {
        var cp = execFile('node', ['./index.js', 'init']);
        var expected = "needs to be run in an empty directory";

        cp.stdout.on('data', function (data) {
            if(data.indexOf(expected) > -1) {
                isDisplayed();
            }
        });
    });
});