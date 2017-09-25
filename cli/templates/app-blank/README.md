## Building a scalable Application with Caplin dev-tools and packages

Below we document some of the common commands you will use as you build your
application using the caplin packages.

### Dependencies
* Node 7 (or higher)
* NPM 4

### Folder Structure

Your initial app structure should look like this:

```
new-app/
  scripts/
  server/
    node/
      server.js
  src/
    config/
    example/
    index.js
    index.scss
  .babelrc
  .env
  index.html
  package.json
  README.md
  webpack.config.js  
```

## Initial Scripts


Once you have installed your application, by running `npm i` from the app root,
you can use the default scripts:

### `npm start`

This will start the app in dev mode, the app is available at
http://localhost:8080 (unless you specify a different port in the .env file)

### Hot Module Replacement

Use the --hot flag to use the hot module replacement feature during development:
npm start -- --hot

### `npm test` or `npm t`

This will launch a browser and run the tests, for further test configuration
please see the package.json file in the app root to configure jest.

### `npm run build`

This will generate a war and a flat file in the build folder of your app, ready to be deployed on a Web server.

The structure of your app, after running the command, can be seen below.

```
new-app/
  .storybook/
  build/
    dist/
      static/
        bundle-dev.js
      index.html
    exported-wars/
      new-app.war
  node_modules/
  scripts/
  server/
  src/
  .babelrc
  .env
  index.html
  package.json
  README.md
  webpack.config.js
```

## Creating Component Scripts

### `caplin-cli create-component <component-name>`

This will prompt you to choose between a blank and a React component.

#### Blank Component

This will result in this folder structure.

```
new-app/
  scripts/
  server/
  src/
    config/
    example/
      __tests__/
      Example.js
    index.js
    index.scss
  .babelrc
  .env
  index.html
  package.json
  README.md
  webpack.config.js
```

#### React Component

React component names must start with a capital letter. Don't forget neither the component nor the
sass file are imported by default. Once you're ready, you have to import them.
This will result in this folder structure.

```
new-app/
  new-component/
    _test-ut/
      react-component-test.js
    react-component.js
    react-component.scss
  scripts/
  server/
  src/
```

## Development using React Storybook

It is possible to create stories for all your React components and load them using
React Storybook. Just run:
```
npm run storybook
```
and you can develop your components in storybook's dashboard, found by navigating to localhost:6006.
Storybook uses hot module replacement to instantly inspect your code or styling changes.

## How to debug Jest tests

There are two ways to debug Jest tests; with chrome devtools or using your IDE of choice (we prefer Visual Studio Code and IntelliJ IDEA). 

### Using Chrome devtools 

Add a debugger where you want your test to pause then just run:

```
npm run test:debug 
``` 

This will return a link in your console, which you can copy and paste into your chrome browser.


### Using an IDE

Once your debugger is in place: 

#### Visual Studio Code 

Just add the following configuration in your .vscode/launch.json file (you can find this in the navigation bar in Debug->Add Configuration..)

```
"program": "${workspaceRoot}/node_modules/jest-cli/bin/jest.js",
 "args": ["--runInBand"]
```
#### IntelliJ IDEA

Just add the following configuration.

From the navigation bar go to  Run -> Debug Configurations -> Add Jest 
Jest package : path/to/your/app/node_modules/jest-cli
Working directory: path/to/your/app
Jest options: --runInBand

Don’t forget to install and enable the nodejs plugin from the JetBrains plugin repository.

## IE11 Support

By default the app does not support IE11, to do so you'll need to add a pollyfill as follows.

Run: 

```
npm install --save babel-polyfill
```

Add "babel-polyfill" in your webpack config's entry ensuring it is placed before your app's entry point.
