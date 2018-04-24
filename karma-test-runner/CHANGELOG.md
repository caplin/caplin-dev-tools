<a name="6.0.0"></a>
# [6.0.0](https://github.com/caplin/caplin-dev-tools/compare/karma-test-runner@5.3.2...karma-test-runner@6.0.0) (2018-04-24)


### Bug Fixes

* Drop babel usage in build ([e3451c6](https://github.com/caplin/caplin-dev-tools/commit/e3451c6))


### Features

* **aliases-test:** Drop support for aliases-test.js in scripts ([7d5be30](https://github.com/caplin/caplin-dev-tools/commit/7d5be30))
* **webpack:** Add support for Webpack 4 ([1043d4f](https://github.com/caplin/caplin-dev-tools/commit/1043d4f))


### BREAKING CHANGES

* Drop support for node.js 6
* **aliases-test:** Drop support for legacy aliases-test.js file location



<a name="5.3.2"></a>
## [5.3.2](https://github.com/caplin/caplin-dev-tools/compare/karma-test-runner@5.3.1...karma-test-runner@5.3.2) (2018-04-19)



<a name="5.3.1"></a>
## [5.3.1](https://github.com/caplin/caplin-dev-tools/compare/karma-test-runner@5.2.1...karma-test-runner@5.3.1) (2018-04-18)



<a name="5.3.0"></a>
# [5.3.0](https://github.com/caplin/caplin-dev-tools/compare/karma-test-runner@5.2.1...karma-test-runner@5.3.0) (2018-03-27)

### Features

* Log out browser disconnects ([3559b23](https://github.com/caplin/caplin-dev-tools/commit/3559b23))

<a name="5.2.1"></a>
## [5.2.1](https://github.com/caplin/caplin-dev-tools/compare/karma-test-runner@5.2.0...karma-test-runner@5.2.1) (2017-12-19)


### Bug Fixes

* Add missing Webpack dependency to package.json ([17cdbdd](https://github.com/caplin/caplin-dev-tools/commit/17cdbdd))



<a name="5.2.0"></a>
# [5.2.0](https://github.com/caplin/caplin-dev-tools/compare/karma-test-runner@5.1.1...karma-test-runner@5.2.0) (2017-11-24)


### Features

* Add support for yarn link ([d310af7](https://github.com/caplin/caplin-dev-tools/commit/d310af7))



<a name="5.1.1"></a>

## 5.1.1 (2017-11-24)

### Bug Fixes

* Display specs total in final status
  ([be6d5b5](https://github.com/caplin/caplin-dev-tools/commit/be6d5b5))
* Don't run tests located inside `node_modules`
  ([292be1d](https://github.com/caplin/caplin-dev-tools/commit/292be1d))
* Escape paths for Windows
  ([c135b16](https://github.com/caplin/caplin-dev-tools/commit/c135b16))
* Exit with non zero code on errors/failures
  ([135c5db](https://github.com/caplin/caplin-dev-tools/commit/135c5db))
* Expand CLI flags that select UTs/ATs
  ([6f082ea](https://github.com/caplin/caplin-dev-tools/commit/6f082ea))
* Filter out comment dependencies
  ([487904d](https://github.com/caplin/caplin-dev-tools/commit/487904d))
* Fix ESLint warning
  ([bf7fdb3](https://github.com/caplin/caplin-dev-tools/commit/bf7fdb3))
* Ignore tests inside a package's `node_modules`
  ([0678ea4](https://github.com/caplin/caplin-dev-tools/commit/0678ea4))
* Speed up webpack compile by removing unused entry
  ([8c440cb](https://github.com/caplin/caplin-dev-tools/commit/8c440cb))
* Support running tests from apps with no src
  ([6a7e9a5](https://github.com/caplin/caplin-dev-tools/commit/6a7e9a5))
* Use plugins from provided webpack config
  ([68a7ada](https://github.com/caplin/caplin-dev-tools/commit/68a7ada))
* Use webpack 2.3.3 due to perfomance regression
  ([3a423bc](https://github.com/caplin/caplin-dev-tools/commit/3a423bc))
* Use unique frameworks array for package config
  ([5cbbecf](https://github.com/caplin/caplin-dev-tools/commit/5cbbecf))
* Configure npm to only publish dist folder
  ([655b77d](https://github.com/caplin/caplin-dev-tools/commit/655b77d))
* Create clone of `files` array to prevent test errors
  ([5612d2b](https://github.com/caplin/caplin-dev-tools/commit/5612d2b))
* Only run UTs
  ([74b1a95](https://github.com/caplin/caplin-dev-tools/commit/74b1a95))
* Remove unnecessary file
  ([524c506](https://github.com/caplin/caplin-dev-tools/commit/524c506))

### Features

* Update to latest karma
  ([041307a](https://github.com/caplin/caplin-dev-tools/commit/041307a))
* Upgrade to webpack 2
  ([560da29](https://github.com/caplin/caplin-dev-tools/commit/560da29))
* Add a Karma test running package
  ([e8c487b](https://github.com/caplin/caplin-dev-tools/commit/e8c487b))
* Create test runner CLI tool
  ([5fb0aec](https://github.com/caplin/caplin-dev-tools/commit/5fb0aec))
* Exit tests when the user hits Ctrl-C
  ([07d3f45](https://github.com/caplin/caplin-dev-tools/commit/07d3f45))
* Export base Karma config and function that extends it
  ([7ddf0dc](https://github.com/caplin/caplin-dev-tools/commit/7ddf0dc))
* Karma runner handles no frameworks and `files` config
  ([266ac79](https://github.com/caplin/caplin-dev-tools/commit/266ac79))
* Log if using the legacy aliases path
  ([86c465a](https://github.com/caplin/caplin-dev-tools/commit/86c465a))
* minor version bump for single test support
  ([3693424](https://github.com/caplin/caplin-dev-tools/commit/3693424))
* Replace caplin-dots with log-update logger
  ([4894da8](https://github.com/caplin/caplin-dev-tools/commit/4894da8))
* Specify which test type in output
  ([91c2172](https://github.com/caplin/caplin-dev-tools/commit/91c2172))
* Support running a single test file
  ([6907486](https://github.com/caplin/caplin-dev-tools/commit/6907486))
* Support upper case AT/UT CLI flag
  ([1f0fdfc](https://github.com/caplin/caplin-dev-tools/commit/1f0fdfc))
* Minimize console output when running UTs
  ([5f2d269](https://github.com/caplin/caplin-dev-tools/commit/5f2d269))
* Add support for running ATs
  ([d1f8234](https://github.com/caplin/caplin-dev-tools/commit/d1f8234))
* Allow users to run only ATs or UTs
  ([7138a0e](https://github.com/caplin/caplin-dev-tools/commit/7138a0e))
* Use latest version of Webpack
  ([2b12e09](https://github.com/caplin/caplin-dev-tools/commit/2b12e09))
