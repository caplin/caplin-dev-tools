## Building a scalable Application with Caplin dev-tools and packages 

Below we document some of the common commands you will use as you build your application using the caplin packages.

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

Once you have installed your applciation, by running `npm i` from the app root, you can use the default scripts:

### `npm run serve`

This will serve the app in dev mode, the app will be served at http://localhost:8080 (unless you have specified a different port in the .env file)

### `npm run test`

This will launch a browser and run the tests, for further test configuration please see the karma.conf.js file in the app root.

### `npm run build`

This will generate a war file ready to be deployed on the Web server of your choice.

