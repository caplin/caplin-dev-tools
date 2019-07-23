const { readdirSync } = require("fs");
const { prompt } = require("enquirer");
const execa = require("execa");
const Listr = require("listr");

const IGNORED_DIRECTORIES = [
  ".git",
  "node_modules",
  "brjs-app-converter",
  "module-source-converter"
];
const choices = readdirSync(".", { withFileTypes: true })
  .filter(
    dirent =>
      dirent.isDirectory() &&
      IGNORED_DIRECTORIES.includes(dirent.name) === false
  )
  .map(dirent => dirent.name);
const packageNamePrompt = {
  type: "autocomplete",
  name: "packageName",
  message: "Pick the package to release",
  limit: 20,
  choices
};
const versionPrompt = {
  type: "select",
  name: "version",
  message: "Pick a version number increment",
  choices: ["patch", "minor", "major"]
};

prompt([packageNamePrompt, versionPrompt])
  .then(releasePackage)
  .catch(console.error);

async function releasePackage({ packageName, version }) {
  const options = { cwd: packageName };
  const tasks = new Listr([
    {
      title: `Bump version in ${packageName} package.json`,
      task: async ctx => {
        const { stdout } = await execa(
          "yarn",
          ["version", `--${version}`, "--no-git-tag-version"],
          options
        );

        ctx.newVersion = stdout.match(/New version: (.*)/)[1];
      }
    },
    {
      title: `Update ${packageName} CHANGELOG.md`,
      task: () =>
        execa("yarn", [
          "conventional-changelog",
          "--preset",
          "angular",
          "--infile",
          `${packageName}/CHANGELOG.md`,
          "--same-file",
          "--commit-path",
          packageName,
          "--pkg",
          packageName,
          "--lerna-package",
          packageName
        ])
    },
    {
      title: `Publishing new ${packageName} version`,
      task: ctx =>
        execa("yarn", ["publish", "--new-version", ctx.newVersion], options)
    },
    {
      title: `Adding ${packageName} CHANGELOG.md and package.json`,
      task: () =>
        execa("git", [
          "add",
          `${packageName}/CHANGELOG.md`,
          `${packageName}/package.json`
        ])
    },
    {
      title: `Commiting ${packageName} CHANGELOG.md and package.json`,
      task: ctx =>
        execa("git", [
          "commit",
          "-m",
          `chore(${packageName}): Release ${packageName}@${ctx.newVersion}`
        ])
    },
    {
      title: `Tagging new ${packageName} version`,
      task: ctx => execa("git", ["tag", `${packageName}@${ctx.newVersion}`])
    },
    {
      title: `Pushing ${packageName} release commit`,
      task: () => execa("git", ["push"])
    },
    {
      title: `Pushing ${packageName} release tag`,
      task: () => execa("git", ["push", "--tags"])
    }
  ]);

  await tasks.run();
}
