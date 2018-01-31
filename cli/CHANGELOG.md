<a name="1.10.0"></a>

# [1.10.0](https://github.com/caplin/caplin-dev-tools/compare/cli@1.9.0...cli@1.10.0) (2018-01-31)

* Add highstock chart component template

<a name="1.9.0"></a>

# [1.9.0](https://github.com/caplin/caplin-dev-tools/compare/cli@1.8.7...cli@1.9.0) (2017-11-16)

### Features

* Application templates no longer need metadata.js modules ([3fbf907](https://github.com/caplin/caplin-dev-tools/commit/3fbf907))

<a name="1.8.7"></a>

## 1.8.7 (2017-11-16)

* Make the server generation asynchronous so that the not-found handler doesn’t get added until the end, even if the user is asynchronously promoted for a port. ([de35f07](https://github.com/caplin/caplin-dev-tools/commit/de35f07))

### Bug Fixes

* Add SASS as app dependency ([6e4d103](https://github.com/caplin/caplin-dev-tools/commit/6e4d103))
* Fix broken build, update babelrc ([551a96a](https://github.com/caplin/caplin-dev-tools/commit/551a96a))
* Server code now moved into `node` folder ([07b6cb4](https://github.com/caplin/caplin-dev-tools/commit/07b6cb4))
* update storybook config to avoid missing plugin errors ([2884df0](https://github.com/caplin/caplin-dev-tools/commit/2884df0))
* Update template dependencies ([188f0d7](https://github.com/caplin/caplin-dev-tools/commit/188f0d7))
* version bump for changes to make sourcemaps default in dev server ([c8dfd4e](https://github.com/caplin/caplin-dev-tools/commit/c8dfd4e))

### Features

* Serve static files from the `static` directory ([e04df0f](https://github.com/caplin/caplin-dev-tools/commit/e04df0f))
* Add I18n data store object to template app index.html ([2689338](https://github.com/caplin/caplin-dev-tools/commit/2689338))
* Update to latest webpack config package ([59cd8d2](https://github.com/caplin/caplin-dev-tools/commit/59cd8d2))
* Use npm start instead of npm run serve ([1e16bc4](https://github.com/caplin/caplin-dev-tools/commit/1e16bc4))

### BREAKING CHANGES

* server.js will have to be updated for existing applications.
