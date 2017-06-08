## Building a scalable Application with Caplin dev-tools and packages

Below we document some of the common commands you will use as you build your
application using the caplin packages.

### Folder Structure

Your initial app structure should look like this:

```
new-app/
  scripts/
  server/
    server.js
    webpack.js
  src/
    config/
    example/
    index.css
    index.js
  .babelrx
  .env
  index.html
  karma.conf
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

### `npm test` or `npm t`

This will launch a browser and run the tests, for further test configuration
please see the karma.conf.js file in the app root.

### `npm run build`

This will generate a war file ready to be deployed on your Web server.

## Creating Component Scripts

### `caplin-cli create-component <component-name>`

This will prompt you to choose between a blank and a React component.

#### Blank Component

This will result in this folder structure.

```
new-app/
  new-component/
    _test-ut/
      component-test.js
    component.js
  scripts/
  server/
  src/
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
