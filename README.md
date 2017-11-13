# caplin-dev-tools
## Packages for developing Caplin applications using node.js tooling

## Setup

This monorepo contains tens of packages, they are designed to be used as part of
a Caplin development environment. They are not designed for usage in generic web
applications.

## caplin-cli

For information on the `caplin-cli` tool [read its README.md](https://github.com/caplin/caplin-dev-tools/blob/master/cli/README.md).

## Releasing packages

We are experimenting with using https://github.com/conventional-changelog/conventional-changelog

To create a `CHANGELOG.md` first `cd` into the package folder and run:

`conventional-changelog --commit-path . -p angular -i CHANGELOG.md -s -r 0`
