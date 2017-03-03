'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var rimraf = require('rimraf');
var assert = require('yeoman-assert');
var fs = require('fs');

var cleanDirectories = function() {
    try {
        rimraf.sync(path.resolve('apps'));
        rimraf.sync(path.resolve('caplin-packages'));
    } catch(e) {
        console.log(e);
    };
};

var initDirectories = function() {
    try {
        fs.mkdirSync(path.resolve('apps'));
        fs.mkdirSync(path.resolve('caplin-packages'));
    } catch(e) {
        console.log(e);
    };
};

describe('create-component', function () {
    afterEach(function() {
        cleanDirectories();
    });

    it('should prompt for a component name', function (prompted) {
        var cp =  execFile('node', ['./index.js', 'create-component']);
        var expected = "What do you want to name your component:";

        cp.stdout.on('data', function (data) {
            if(data.indexOf(expected) > -1) {
                prompted();
            }
        });
    });

    it('creates correct files for a component', function () {
        //todo
    });
});