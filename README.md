# Caplin dev tools

## Packages for developing Caplin applications using node.js tooling

This monorepo contains packages that are designed to be used as part of
a Caplin development environment. They are not designed for usage in generic web
applications. The more important packages have their own README.md files.

## caplin-cli

For information on the `caplin-cli` tool
[read its README.md](https://github.com/caplin/caplin-dev-tools/blob/master/cli/README.md).

## Releasing packages

We are using [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) to
programatically create changelogs.

### Creation of CHANGELOG.md

If the package you are modifying has no `CHANGELOG.md` file, then create a
`CHANGELOG.md`. First `cd` into the package folder and run:

`conventional-changelog -p angular -i CHANGELOG.md -s -r 0 --commit-path .`

You should run this **before** you make your commits and update the
`package.json` version.

Then tag the package's last release (the last time its version was updated).

`git tag express-dev-server@4.0.1 50100c3aa8376e`

The format of the tag is `NAME_OF_PACKAGE@LAST_PUBLISHED_VERSION` and the commit
is the commit where the `package.json` version was changed.

Push the newly created tag to the server

`git push origin express-dev-server@4.0.1`

### Releasing a new package

1.  Make changes
2.  Commit those changes
3.  `yarn run release`
