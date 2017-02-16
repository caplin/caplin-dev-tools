# Building Apps with Caplin-cli

**Caplin-cli is a command line module to create Node.js apps**

[![Build Status](https://api.travis-ci.org/caplin/caplin-cli.svg)](https://api.travis-ci.org/caplin/caplin-cli)

## Getting started

#### Installation

    npm install -g caplin/caplin-cli

#### Initialising the Workspace

    caplin-cli init

This will generate the following folder structure:

```
apps/
caplin-packages/
custom-packages/
```

#### Create an app

    caplin-cli create-app myapp

The newly created app will be placed in an apps folder. To serve the app, cd into the newly created app directory and run `npm run serve`

#### More commands

For a list of available commands and options, use the help command

    caplin-cli help