# BRJS application converter

## What

Restructures a BRJS application to a CT5 compatible structure.

## What - in depth

Given a BRJS application directory this tool will move the contents of the
application directory to new locations within the application directory.

1. It's first step is to back up the entire folder (except for hidden files)
   into a `brjs-app-backup` directory. This allows a user to access the old
   application files.
2. It then creates a top level directory (`packages-caplin`) for the application
   packages.
3. It copies all the application's libs and SDK libs into the packages
   directory.
   * While copying them it generates a stub `package.json` for each
     copied directory.
4. It then creates another top level directory called `apps`.
5. Within this directory it creates a directory for the restructured
   application.
   * For an app named `mobile` it creates `apps/mobile` and populates it with
     a few application files that the user provides.
   * It also creates a `src` directory for the application `apps/mobile/src`
     that contains the blades/bladesets and aspects of the application.

This leaves the project with three top level directories, `apps`,
`packages-caplin`, and `brjs-app-backup` (which can be deleted once the user is
satisfied they don't need the old files).

These screenshots contrast before and after (after shows a monorepo with several
applications, the conversion tool only converts one app at a time):

![alt text](https://raw.githubusercontent.com/caplin/caplin-dev-tools/master/brjs-app-converter/preparation/current.png "Current Structure")
![alt text](https://raw.githubusercontent.com/caplin/caplin-dev-tools/master/brjs-app-converter/preparation/post.png "Post Conversion Structure")

## How

Firstly the tool needs to be installed via npm, this can be done with

`npm i -g caplin/caplin-dev-tools`

Which asks npm to install (`i`) the repo globally (`-g`), this means the command
`brjs-app-converter` is now made available on the command line.

The conversion tool uses any user provided application configuration files
(`aliases.js`, `metadata.js`, `html-templates.js`) that are placed in a
`conversion-data` directory next to the BRJS project directory.

The screenshot below shows the files/folders that can be inside the
`conversion-data` directory, they aren't all required to test a conversion.
There is no need to copy the application source into `conversion-data`.

![alt text](https://raw.githubusercontent.com/caplin/caplin-dev-tools/master/brjs-app-converter/preparation/conversion-data.png "Conversion data")

In the `conversion-data` directory you can place an `sdk` directory and if that
exists it will be used instead of the application's own `sdk` directory. The
application config files have to be placed inside a directory with the same name
as the application e.g. for an app called `mobile` place the files you wish
copied into the converted application in `conversion-data\mobile`. The files
that can be copied are the `index.js` module, the application `package.json` and
the `config` and `server` directories.

Then you must navigate to the BRJS project root directory (e.g. C/dev/someApp,
not C/dev/someApp/apps/someApp) and run the tool.

```bash
brjs-app-converter --app mobile
```

The parameters mean:

* Provide the name of the app directory to convert with `--app`.

## Following steps.

Change into your new application directory i.e. `apps/mobile` if following the
example invocation above. Install your application's dependencies,

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

Some thirdparty libraries expect the `this` reference to point to the global
object (`window` in a browser), but webpack wraps modules in a `'use strict'`
IIFE and rewrites top level `this` references to `undefined`, these libraries
will need to have `this` set to the `window` object, this can be done with
webpack's `imports-loader`. Examples of its use are included in the generated
`webpack.config.js` file.

Caplin `EventHub` uses the `getClass` method which requires there to be a global
namespace structure pointing to the class, when the code is fully CJS or when
it's loaded by webpack the global namespace structure is not created. This will
require changing the code to use `var MyClass = require('CLASS_NAME')` instead
and passing the class in as a trailing parameter to `getProxy` and `subscribe`,
the gc-cli tool [handles this automatically](https://github.com/caplin/gc-cli/commit/15c465fb9cac8a669e495c7315130dad06c0fe86).

## Preparation

These operations should be performed on the application before conversion. It's
possible to make these changes without breaking the BRJS application. Verify the
BRJS application still works following these changes. It is possible to run the
conversion without completing these steps but it's likely the application will
not load.

* The codebase should be converted to CJS, this can be done using https://github.com/caplin/gc-cli
* Third party libraries that don't export a value should have their `exports`
  property in their `thirdparty-lib.manifest` file set to `null`; if it's set to
  `"{}"` errors will be thrown during bundling.
* Capture the application's aliases to an aliases file. The aliases can be
  captured by searching for the `alias!$data` network request or the `alias!$data`
  module in the BRJS `bundle.js`. The aliases bundle can be converted by running
  the `jscodeshift` transform script called `aliases-transform.js` which is stored
  inside the `preparation` directory using the `astexplorer.net` website.
* Capture the applications's metadata. This can be done by executing
  `require("app-meta!$data")` when the application is running in BRJS. A
  `metadata.js` module should be created in the application's `conversion-data`
  `config` directory containing that metadata. The code below is an example of a
  metadata module.

```javascript
const VERSION = process.env.VERSION || "dev";

module.exports = {
  APP_VERSION: process.env.NODE_ENV === "production" ? VERSION : "dev",
  VERSIONED_BUNDLE_PATH: "v/dev",
  LOCALE_COOKIE_NAME: "BRJS.LOCALE",
  APP_LOCALES: {
    en: true
  }
};
```

## Side effects

The conversion tool moves source files which means that when searching the
history of a file in git the `--follow` flag will be required to view the
pre-move history. Being unable to follow moves also affects tools like `gitk`
and stash.

## Tips

To create the `css`/`less`/`sass` imports for the app being converted open the
BRJS CSS bundles and extract the bundled files with this RegExp in Atom.

`[^]*?/\*\*\* ([./a-z-A-Z\d]*) \*\*\*/`

you can convert the comments to imports with this replacement pattern.

`import '$1';\n`

Then change the file paths to the new structure by removing incorrect prefixes
e.g. `libs/` and replace `/resources/` with `/_resources/` in file paths. Change
`.css` to `.less` if required. `default-aspect/` to `./$TRADER-default-aspect/`,
`'.*blades/` with `'./`.

To extract the transforms/handlers from a `renderDefinitions.xml` file use this
RegExp

`[^]*?<(handler|transform) className="(.*?)"`

`import '$2';\nBehaviorFactory.BEHAVIOUR_CLASSES['$2'] = $2;\n`

To extract the controls from a `renderDefinitions.xml` file use this RegExp

`[^]*?<control className="(.*?)"`

`import '$1';\nControlFactory.CONTROL_CLASSES['$1'] = $1;\n`
