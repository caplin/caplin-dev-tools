# Building Apps with Caplin-cli

**Caplin-cli is a command line module to create Node.js apps**

## Getting started

#### Prerequisites

 * Node v7.6+

#### Installation

    npm install -g caplin-cli

#### Initialising the Workspace

    caplin-cli init

This will generate the following folder structure:

```
apps/
packages/
packages-caplin/
```

#### Create an app

    caplin-cli create-app myapp

The newly created app will be placed in an apps folder. To start the app, `cd`
into the newly created app directory run `npm install` and `npm start`

#### Create a component

    caplin-cli create-component MyComponent react src

This will create a react component called MyComponent in the src directory. If you do not sepcify arguments for the create-component command you will be given dropdown options for the component name, type and location.

#### More commands

For a list of available commands and options, use the help command

    caplin-cli help
