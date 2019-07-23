const { readdirSync } = require("fs");
const { prompt } = require("enquirer");
const execa = require("execa");

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
  const { stdout } = await execa(
    "yarn",
    ["version", `--${version}`, "--no-git-tag-version"],
    options
  );
  const newVersion = stdout.match(/New version: (.*)/)[1];

  await execa("yarn", [
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
  ]);
  await execa("git", [
    "add",
    `${packageName}/CHANGELOG.md`,
    `${packageName}/package.json`
  ]);
  await execa("git", [
    "commit",
    "-m",
    `chore(${packageName}): Release ${packageName}@${newVersion}`
  ]);
  await execa("git", ["tag", `${packageName}@${newVersion}`]);
  await execa("git", ["push"]);
  await execa("git", ["push", "--tags"]);
  await execa("yarn", ["publish", "--new-version", newVersion], options);
}
