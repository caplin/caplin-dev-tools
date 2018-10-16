<a name="8.0.0-alpha.2"></a>
# [8.0.0-alpha.2](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@8.0.0-alpha.1...webpack-config-app@8.0.0-alpha.2) (2018-10-16)


### Bug Fixes

* **babel:** Don't resolve the location of Babel presets and plugins ([6639e64](https://github.com/caplin/caplin-dev-tools/commit/6639e64))



<a name="8.0.0-alpha.1"></a>
# [8.0.0-alpha.1](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@7.2.0...webpack-config-app@8.0.0-alpha.1) (2018-10-09)


### Features

* **webpack-config:** Move to Babel 7 ([778d313](https://github.com/caplin/caplin-dev-tools/commit/778d313))


### BREAKING CHANGES

* **webpack-config:** Drop support for Babel 6



<a name="7.2.0"></a>
# [7.2.0](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@7.1.0...webpack-config-app@7.2.0) (2018-07-03)


### Features

* **config:** Add support for cur files ([1fef88f](https://github.com/caplin/caplin-dev-tools/commit/1fef88f))



<a name="7.1.0"></a>
# [7.1.0](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@7.0.2...webpack-config-app@7.1.0) (2018-04-30)


### Features

* **patches:** Allow configuring patches location ([3721ef1](https://github.com/caplin/caplin-dev-tools/commit/3721ef1))



<a name="7.0.2"></a>
## [7.0.2](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@7.0.1...webpack-config-app@7.0.2) (2018-04-25)


### Features

* **webpack-config:** Add support for .eot files ([e75043b](https://github.com/caplin/caplin-dev-tools/commit/e75043b))



<a name="7.0.1"></a>
## [7.0.1](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@7.0.0...webpack-config-app@7.0.1) (2018-04-24)


### Bug Fixes

* **i18n:** Upgrade `extract-text-webpack-plugin` to Webpack 4 version ([655d275](https://github.com/caplin/caplin-dev-tools/commit/655d275))



<a name="7.0.0"></a>
# [7.0.0](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@6.3.1...webpack-config-app@7.0.0) (2018-04-24)


### Features

* Add support for Webpack 4 ([f216192](https://github.com/caplin/caplin-dev-tools/commit/f216192))


### BREAKING CHANGES

* Drop support for Webpack <4



<a name="6.3.1"></a>
## [6.3.1](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@6.3.0...webpack-config-app@6.3.1) (2018-04-18)


### Bug Fixes

* Update tests to reflect recent changes ([961efa8](https://github.com/caplin/caplin-dev-tools/commit/961efa8))



<a name="6.3.0"></a>
# [6.3.0](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@6.2.0...webpack-config-app@6.3.0) (2018-02-16)


### Features

* **file-loader:** Added support for loading ttf files ([fc108f5](https://github.com/caplin/caplin-dev-tools/commit/fc108f5))



<a name="6.2.0"></a>
# [6.2.0](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@6.1.5...webpack-config-app@6.2.0) (2018-01-24)

* **build** Set `process.env.NODE_ENV` to `production` when building.

<a name="6.1.5"></a>
## [6.1.5](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@6.1.4...webpack-config-app@6.1.5) (2018-01-16)


### Bug Fixes

* **babel:** Compile caplin packages in mobile/REX ([d850d54](https://github.com/caplin/caplin-dev-tools/commit/d850d54))



<a name="6.1.4"></a>
## [6.1.4](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@6.1.3...webpack-config-app@6.1.4) (2017-12-05)


### Bug Fixes

* **babel:** Don't compile thirdparty packages ([fee4f70](https://github.com/caplin/caplin-dev-tools/commit/fee4f70))



<a name="6.1.3"></a>
## [6.1.3](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@6.1.2...webpack-config-app@6.1.3) (2017-12-05)


### Bug Fixes

* **babel:** Add packages to list of packages to compile ([f2cad92](https://github.com/caplin/caplin-dev-tools/commit/f2cad92))



<a name="6.1.2"></a>
## [6.1.2](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@6.1.0...webpack-config-app@6.1.2) (2017-12-05)


### Bug Fixes

* **babel:** Verify existance of packages dir ([e0d0c2e](https://github.com/caplin/caplin-dev-tools/commit/e0d0c2e))



<a name="6.1.1"></a>
## [6.1.1](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@6.1.0...webpack-config-app@6.1.1) (2017-11-29)


### Bug Fixes

* Don't Babel compile thirdparty dependencies ([b477d93](https://github.com/caplin/caplin-dev-tools/commit/b477d93))



<a name="6.1.0"></a>
# [6.1.0](https://github.com/caplin/caplin-dev-tools/compare/webpack-config-app@6.0.2...webpack-config-app@6.1.0) (2017-11-27)


### Features

* Add support for yarn link ([c2c826b](https://github.com/caplin/caplin-dev-tools/commit/c2c826b))



<a name="6.0.2"></a>

## 6.0.2 (2017-11-24)

### Bug Fixes

* Delete services modules from webpack cache in tests
  ([07c2196](https://github.com/caplin/caplin-dev-tools/commit/07c2196))
* Add babel-core as a dependency, babel-loader peer dependency
  ([35e571c](https://github.com/caplin/caplin-dev-tools/commit/35e571c))
* Add empty `alias` object to `resolve` config
  ([44769f2](https://github.com/caplin/caplin-dev-tools/commit/44769f2))
* Add existance check for packages-caplin
  ([33b5237](https://github.com/caplin/caplin-dev-tools/commit/33b5237))
* Add final packages-caplin location to babel exclude scan list
  ([bcf6bfd](https://github.com/caplin/caplin-dev-tools/commit/bcf6bfd))
* Alias jasmine to the published JSTD package
  ([11bf1fc](https://github.com/caplin/caplin-dev-tools/commit/11bf1fc))
* Alias the BRJSClassUtility to the null module
  ([79a0463](https://github.com/caplin/caplin-dev-tools/commit/79a0463))
* App code is now in libs directory
  ([f2747ec](https://github.com/caplin/caplin-dev-tools/commit/f2747ec))
* Append dir sep to dirs to babel exclude, prevents false positives
  ([6943e51](https://github.com/caplin/caplin-dev-tools/commit/6943e51))
* Compile br services package
  ([ba826fd](https://github.com/caplin/caplin-dev-tools/commit/ba826fd))
* Handle babel presets with options
  ([87befe4](https://github.com/caplin/caplin-dev-tools/commit/87befe4))
* Ignore `babel-polyfill` in babel-loader config
  ([707f3e8](https://github.com/caplin/caplin-dev-tools/commit/707f3e8))
* Log module requested by getClass
  ([81cfd62](https://github.com/caplin/caplin-dev-tools/commit/81cfd62))
* Make babel exclude RegExp stricter
  ([a703e16](https://github.com/caplin/caplin-dev-tools/commit/a703e16))
* Make reading of packages directory relative to basePath
  ([d1cd2c1](https://github.com/caplin/caplin-dev-tools/commit/d1cd2c1))
* Only exclude thirdparty libraries from babel
  ([666dd79](https://github.com/caplin/caplin-dev-tools/commit/666dd79))
* Provide preset config to babel
  ([3d2850e](https://github.com/caplin/caplin-dev-tools/commit/3d2850e))
* Remove resolve module
  ([1587d31](https://github.com/caplin/caplin-dev-tools/commit/1587d31))
* Resolve .babelrc plugins
  ([fc4db4f](https://github.com/caplin/caplin-dev-tools/commit/fc4db4f))
* Resolve packages from `packages-caplin`
  ([bc7e4fb](https://github.com/caplin/caplin-dev-tools/commit/bc7e4fb))
* Specify module resolving directory for npm5
  ([aed33af](https://github.com/caplin/caplin-dev-tools/commit/aed33af))
* Support debugging build script
  ([c470c4f](https://github.com/caplin/caplin-dev-tools/commit/c470c4f))
* Support looking for packages in directory
  ([b49cf34](https://github.com/caplin/caplin-dev-tools/commit/b49cf34))
* Use absolute paths to loaders
  ([2691e07](https://github.com/caplin/caplin-dev-tools/commit/2691e07))
* Use directory seperator that matches Windows paths
  ([096919e](https://github.com/caplin/caplin-dev-tools/commit/096919e))
* Add missing dependency
  ([902dc68](https://github.com/caplin/caplin-dev-tools/commit/902dc68))
* Allow config to be created when debugging in VSCode
  ([de7619a](https://github.com/caplin/caplin-dev-tools/commit/de7619a))
* Update version
  ([d84b3ab](https://github.com/caplin/caplin-dev-tools/commit/d84b3ab))
* Allow webpack-config and alias-loader to be debugged via VS Code
  ([1552bca](https://github.com/caplin/caplin-dev-tools/commit/1552bca))
* Replace i18n tokens in required XML files
  ([06fb4a7](https://github.com/caplin/caplin-dev-tools/commit/06fb4a7))
* Move babel config to .babelrc file
  ([3fdd25c](https://github.com/caplin/caplin-dev-tools/commit/3fdd25c))
* Use webpack 2.3.3 due to perfomance regression
  ([3a423bc](https://github.com/caplin/caplin-dev-tools/commit/3a423bc))

### Features

* Add post build hook and move build artefacts to build
  ([9700730](https://github.com/caplin/caplin-dev-tools/commit/9700730))
* Convert all application `src` to `src` imports to relative
  ([eab6be3](https://github.com/caplin/caplin-dev-tools/commit/eab6be3))
* Add support for WOFF2 file type
  ([9307275](https://github.com/caplin/caplin-dev-tools/commit/9307275))
* Don't include all src directories as resolve roots
  ([e9d82d4](https://github.com/caplin/caplin-dev-tools/commit/e9d82d4))
* Remove loader/configuration
  ([9e42a4b](https://github.com/caplin/caplin-dev-tools/commit/9e42a4b))
* App packages are now in the app libs directory
  ([65a49dd](https://github.com/caplin/caplin-dev-tools/commit/65a49dd))
* Change the app code directory name to src
  ([a245c35](https://github.com/caplin/caplin-dev-tools/commit/a245c35))
* Add support to webpack config and patch loader
  ([5cb60c5](https://github.com/caplin/caplin-dev-tools/commit/5cb60c5))
* Register HTML template with HTML service on require
  ([1dbd80b](https://github.com/caplin/caplin-dev-tools/commit/1dbd80b))
* Add an inline i18n loader
  ([74fc98a](https://github.com/caplin/caplin-dev-tools/commit/74fc98a))
* Extract the i18n resources to a separate file
  ([e5e0697](https://github.com/caplin/caplin-dev-tools/commit/e5e0697))
* Use latest version of Webpack
  ([2b12e09](https://github.com/caplin/caplin-dev-tools/commit/2b12e09))
* Add dependencies for caplin npm packages
  ([24df0c6](https://github.com/caplin/caplin-dev-tools/commit/24df0c6))
* Add support for gif loading
  ([c762a79](https://github.com/caplin/caplin-dev-tools/commit/c762a79))
* Add support for JSX files
  ([0e3653a](https://github.com/caplin/caplin-dev-tools/commit/0e3653a))
* Add support for loading XML files
  ([49c15ed](https://github.com/caplin/caplin-dev-tools/commit/49c15ed))
* Add support for packages-caplin
  ([d6b627b](https://github.com/caplin/caplin-dev-tools/commit/d6b627b))
* Alias dynamic require modules to null module
  ([a707c3c](https://github.com/caplin/caplin-dev-tools/commit/a707c3c))
* Allow UglifyJS plugin to be configurable
  ([c345ddb](https://github.com/caplin/caplin-dev-tools/commit/c345ddb))
* Allow users to set I18n file name
  ([0d06357](https://github.com/caplin/caplin-dev-tools/commit/0d06357))
* Drop SASS support
  ([da8ce9e](https://github.com/caplin/caplin-dev-tools/commit/da8ce9e))
* Export UglifyJS2 default configuration options
  ([c7274ad](https://github.com/caplin/caplin-dev-tools/commit/c7274ad))
* Remove app-meta-loader
  ([4be4f80](https://github.com/caplin/caplin-dev-tools/commit/4be4f80))
* Resolve babel transforms relative to `basePath`
  ([7668977](https://github.com/caplin/caplin-dev-tools/commit/7668977))
* Move js-patches folder to apps directory
  ([4cf1233](https://github.com/caplin/caplin-dev-tools/commit/4cf1233))
* Serve static files from the `static` directory
  ([e04df0f](https://github.com/caplin/caplin-dev-tools/commit/e04df0f))
* Standardize on version value containing git hash
  ([4333497](https://github.com/caplin/caplin-dev-tools/commit/4333497))
* Upgrade to webpack 2
  ([560da29](https://github.com/caplin/caplin-dev-tools/commit/560da29))
* Support developing with symlinked packages
  ([89b50c1](https://github.com/caplin/caplin-dev-tools/commit/89b50c1))
* Use AliasesPlugin for aliases and services
  ([03704f8](https://github.com/caplin/caplin-dev-tools/commit/03704f8))
* Use caplin packages for aliases and services
  ([13e4aa5](https://github.com/caplin/caplin-dev-tools/commit/13e4aa5))
* Use CLI flag to control source maps usage
  ([0cad872](https://github.com/caplin/caplin-dev-tools/commit/0cad872))
* updating version for changes to enable compilation errors in the browser.
  ([3a0f05f](https://github.com/caplin/caplin-dev-tools/commit/3a0f05f))
* Add an XML loader that automatically registers XML files
  ([9bb246c](https://github.com/caplin/caplin-dev-tools/commit/9bb246c))
