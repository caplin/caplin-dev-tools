<a name="6.0.0"></a>
# [6.0.0](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@5.1.0...express-dev-server@6.0.0) (2018-10-16)


### Features

* **proxy-factory:** Terminate the server on proxy process errors ([8802476](https://github.com/caplin/caplin-dev-tools/commit/8802476))


### BREAKING CHANGES

* **proxy-factory:** It's possible that certain errors don't affect the
running of the proxy target.



<a name="5.1.0"></a>
# [5.1.0](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@5.0.0...express-dev-server@5.1.0) (2018-07-02)


### Features

* **express-server:** Add configurable route paths for index page ([8dec7c2](https://github.com/caplin/caplin-dev-tools/commit/8dec7c2))



<a name="5.0.0"></a>
# [5.0.0](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.6.1...express-dev-server@5.0.0) (2018-04-24)


### Features

* **webpack:** Add support for Webpack 4 ([0c0df81](https://github.com/caplin/caplin-dev-tools/commit/0c0df81))


### BREAKING CHANGES

* **webpack:** Drop support for Webpack <4



<a name="4.6.1"></a>
## [4.6.1](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.6.0...express-dev-server@4.6.1) (2018-04-18)



<a name="4.6.0"></a>
# [4.6.0](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.5.1...express-dev-server@4.6.0) (2018-04-13)


### Features

* **proxy:logging:** Pass in logging file location Java property ([ecc0239](https://github.com/caplin/caplin-dev-tools/commit/ecc0239))



<a name="4.5.1"></a>
## [4.5.1](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.5.0...express-dev-server@4.5.1) (2018-04-12)


### Bug Fixes

* **webpack:** Add missing peerDependency to webpack-dev-middleware ([5f104ae](https://github.com/caplin/caplin-dev-tools/commit/5f104ae))



<a name="4.5.0"></a>
# [4.5.0](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.4.0...express-dev-server@4.5.0) (2018-04-11)



<a name="4.5.0"></a>
# 4.5.0 (2018-04-11)


### Bug Fixes

* **server:** Don't log compile success before compilation finishes ([111edec](https://github.com/caplin/caplin-dev-tools/commit/111edec))
* **webpack:** Log compile success message after first compilation ([5c6bba4](https://github.com/caplin/caplin-dev-tools/commit/5c6bba4))


### Features

* **logging:** Change default log level to info ([c9e1b3a](https://github.com/caplin/caplin-dev-tools/commit/c9e1b3a))
* **proxy-target-factory:** Reduce logging output on Jetty start ([8ce8202](https://github.com/caplin/caplin-dev-tools/commit/8ce8202))



<a name="4.4.0"></a>
# [4.4.0](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.3.2...express-dev-server@4.4.0) (2018-04-05)


### Features

* **jndi:** Reduce logging from JNDI module ([b1e6b38](https://github.com/caplin/caplin-dev-tools/commit/b1e6b38))



<a name="4.3.2"></a>
## [4.3.2](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.3.1...express-dev-server@4.3.2) (2018-04-04)



<a name="4.3.1"></a>
## [4.3.1](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.3.0...express-dev-server@4.3.1) (2018-03-09)


### Bug Fixes

* **jndi:** Support empty string environment values ([5105e57](https://github.com/caplin/caplin-dev-tools/commit/5105e57))



<a name="4.3.0"></a>
# [4.3.0](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.2.0...express-dev-server@4.3.0) (2017-12-06)


### Features

* **JNDI:** Create a standalone JNDI replacement module ([8923dc9](https://github.com/caplin/caplin-dev-tools/commit/8923dc9))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.1.0...express-dev-server@4.2.0) (2017-11-21)


### Features

* Add a module that proxies all requests to a Jetty server ([7e00278](https://github.com/caplin/caplin-dev-tools/commit/7e00278))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/caplin/caplin-dev-tools/compare/express-dev-server@4.0.1...express-dev-server@4.1.0) (2017-11-14)


### Features

* **keymaster:** Allow configuring timestamp timezone ([5e670f7](https://github.com/caplin/caplin-dev-tools/commit/5e670f7))



<a name="4.0.1"></a>
## 4.0.1 (2017-11-14)


### Bug Fixes

* Move babel config to .babelrc file ([3fdd25c](https://github.com/caplin/caplin-dev-tools/commit/3fdd25c))
* Only publish compiled files ([b4abb01](https://github.com/caplin/caplin-dev-tools/commit/b4abb01))
* Add object default parameters, error handling ([313dd24](https://github.com/caplin/caplin-dev-tools/commit/313dd24))
* Publish proxy error catching ([3c1b4fb](https://github.com/caplin/caplin-dev-tools/commit/3c1b4fb))
* Retrieve unbundled resources from their new dir ([08175d3](https://github.com/caplin/caplin-dev-tools/commit/08175d3))
* Spawn `mvn` in a new shell for Windows ([dd6dbe0](https://github.com/caplin/caplin-dev-tools/commit/dd6dbe0))
* Use webpack 2.3.3 due to perfomance regression ([3a423bc](https://github.com/caplin/caplin-dev-tools/commit/3a423bc))
* Allow user to specify `customerID` for KeyMaster ([700e934](https://github.com/caplin/caplin-dev-tools/commit/700e934))
* Disable extract text plugin console output ([575f99e](https://github.com/caplin/caplin-dev-tools/commit/575f99e))
* Make the server generation asynchronous so that the not-found handler doesn’t get added until the end, even if the user is asynchronously promoted for a port. ([de35f07](https://github.com/caplin/caplin-dev-tools/commit/de35f07))


### Features

* Add a module for creating proxy servers ([4a5d72e](https://github.com/caplin/caplin-dev-tools/commit/4a5d72e))
* Create an express-dev-server package ([628edb9](https://github.com/caplin/caplin-dev-tools/commit/628edb9))
* App packages are now in the app libs directory ([65a49dd](https://github.com/caplin/caplin-dev-tools/commit/65a49dd))
* Change the app code directory name to src ([a245c35](https://github.com/caplin/caplin-dev-tools/commit/a245c35))
* Allow user to register server handlers after server creation ([a62d603](https://github.com/caplin/caplin-dev-tools/commit/a62d603))
* Add a `proxy-target-factory` module ([940c90b](https://github.com/caplin/caplin-dev-tools/commit/940c90b))
* Add index page handling and log on missing JNDI values ([758ab19](https://github.com/caplin/caplin-dev-tools/commit/758ab19))
* Upgrade to webpack 2 ([560da29](https://github.com/caplin/caplin-dev-tools/commit/560da29))
* Add support for login protected index page ([d295b3f](https://github.com/caplin/caplin-dev-tools/commit/d295b3f))
* Add support for Polling servlet ([77e2a2b](https://github.com/caplin/caplin-dev-tools/commit/77e2a2b))
* Add webcentric module ([9ac4e51](https://github.com/caplin/caplin-dev-tools/commit/9ac4e51))
* Load `.env` files at server startup ([018d53d](https://github.com/caplin/caplin-dev-tools/commit/018d53d))
* Make port configurable via environment variable ([0abfa96](https://github.com/caplin/caplin-dev-tools/commit/0abfa96))
* Add KeyMaster support ([ddeebb3](https://github.com/caplin/caplin-dev-tools/commit/ddeebb3))
* Use latest version of Webpack ([2b12e09](https://github.com/caplin/caplin-dev-tools/commit/2b12e09))


### BREAKING CHANGES

* server.js will have to be updated for existing applications.



