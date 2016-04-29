# BRJS application converter

## What

Restructures a BRJS application to a simpler, flatter structure that integrates more smoothly with npm and webpack.

## What - in depth

Given a BRJS application directory this tool will move the contents of the application directory to new locations
within the application directory.

1. It's first step is to back up the entire folder (except for hidden files) into a `brjs-app` directory. This allows
a user to access the old application files.
2. It then creates a new top level directory for the application packages.
3. It copies all the application's libs and SDK libs into the packages directory.
	* While copying them it generates a stub `package.json` for each copied directory.
4. It then creates another top level directory called `apps`.
5. Within this directory it creates a directory for the restructured application.
	* For an app named `mobile` it creates `apps/mobile` and populates it with a few application files that the user
	provides.

This leaves the project with three top level directories, `apps`, `packages`, and `brjs-app` (which can be
deleted once the user is satisfied they don't need the old files).

These screenshots contrast before and after:

![alt text](https://github.com/caplin/caplin-dev-tools/brjs-app-converter/raw/master/preparation/current.png "Current Structure")
![alt text](https://github.com/caplin/caplin-dev-tools/brjs-app-converter/raw/master/preparation/post.png "Post Conversion Structure")

## How

Firstly the tool needs to be installed via npm, this can be done with

`npm i -g caplin/caplin-dev-tools`

Which asks npm to install (`i`) the repo globally (`-g`), this means the command `brjs-app-converter` is now made
available on the command line.

The conversion tool requires the user to provide their application files by placing them in a `conversion-data`
directory next to the BRJS project directory. In the `conversion-data` directory you can place an `sdk` directory and
if that exists it will be used instead of the application's own `sdk` directory. The application files have to be
placed inside a directory with the same name as the application e.g. for an app called `mobile` place the files you
wish copied into the converted application in `conversion-data\mobile`. The files that can be copied are the `index.js`
module, the application `package.json` and the `config` and `server` directories.

Then you must navigate into the BRJS project directory (e.g. C/dev/someApp, not C/dev/someApp/apps/someApp) and run the
tool.

```bash
brjs-app-converter --app mobile
```

The parameters mean:

* Provide the name of the app to convert with `--app`.

## Following steps.

Change into your new application directory i.e. `apps/mobile` if following the example invocation above.
Install your application's dependencies,

```bash
npm i
```

Launch the application's Express server,

```bash
npm run serve
```

## Notes

To revert the conversion of a git repository run.

```bash
git checkout .
git clean -xdf
```

## Debugging issues

Some thirdparty libraries expect the `this` reference to point to the global object (`window` in a browser), but webpack
wraps modules in a `'use strict'` IIFE and rewrites top level `this` references to `undefined`, these libraries will
need to have `this` set to the `window` object, this can be done with webpack's `imports-loader`. Examples of its use
are included in the generated `webpack.config.js` file.

Caplin `EventHub` uses the `getClass` method which requires there to be a global namespace structure pointing to the
class, when the code is fully CJS or when it's loaded by webpack the global namespace structure is not created. To work
around this you can create a global namespace and assign the class that is being requested to the global namespace.

## Required preparation

These operations need to be performed on the application before conversion. It should be possible to make these changes
without breaking the BRJS application. Verify the BRJS application still works following these changes.

* The codebase should be converted to CJS, this can be done using https://github.com/caplin/gc-cli
* Third party libraries that don't export a value should have their `exports` property in their
`thirdparty-lib.manifest` file set to `null`; if it's set to `"{}"` errors will be thrown during bundling.
* Capture the application's aliases to an aliases file. The aliases can be captured by searching for the `alias!$data`
network request or executing `require("alias!$data")` when the application is running in BRJS.
* Capture the applications's metadata. This can be done by executing `require("app-meta!$data")` when the application
is running in BRJS. A `metadata.js` module is created by the conversion and you can paste the metadata in there
following the conversion.
* `service!` imports should be wrapped in try/catch blocks. The modules should then use `ServiceRegistry.getService` to
access the service. This allows the services to be loaded in BRJS and to be used in both BRJS and webpack. The try/catch
block prevents the bundle from failing to load in webpack and accessing the services via the
`ServiceRegistry.getService` method avoids this issue https://github.com/BladeRunnerJS/brjs/issues/1213.
N.B. Do not move the `service!` requires to the module head as these requires have side effects (they cause the
`ServiceRegistry` to construct services before the application code has had a chance to run).
* `alias!` imports should be treated in a similar manner as `service!` but `AliasRegistry.getClass` should be used
to access them. `alias!` requires can be moved to the head of the module as there are no harmful side effects to
requiring them in module scope.
