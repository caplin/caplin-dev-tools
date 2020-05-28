const { execSync } = require("child_process");

const execOptions = {
  encoding: "utf8"
};

function getHash(hashLength = 8) {
  return execSync("git rev-parse HEAD", execOptions)
    .trim()
    .substr(0, hashLength);
}

function getCommitCount() {
  return execSync("git rev-list --count HEAD", execOptions).trim();
}

function getBranchDescriptor(dontAppendBranchName) {
  let stdout;

  // This approach to generating a version relies on the project being stored
  // in a git repository, if it's not the user should seek an alternate way of
  // generating versions.
  try {
    stdout = execSync("git rev-parse --abbrev-ref HEAD", execOptions);
  } catch (err) {
    console.warn("\n", err.stack, "\n\n");

    console.warn("**** Exception while generating application version. ****");
    console.warn("The application may not be stored in a git repository.");
    console.warn("If that is the case please select another approach to");
    console.warn("generating application versions.");

    process.exit(1);
  }

  const currentBranch = stdout.trim();

  // To prevent a trailing `-` being suffixed to the version if a
  // `branchDescriptor` is available we prefix the descriptor with `-` if it
  // exists else return a blank string.
  return dontAppendBranchName ? "" : `-${currentBranch}`;
}

module.exports = (semVer, { hashLength, dontAppendBranchName } = {}) => {
  const branchDescriptor = getBranchDescriptor(dontAppendBranchName);
  const commitCount = getCommitCount();
  const hash = getHash(hashLength);

  return `${semVer}-${commitCount}-${hash}${branchDescriptor}`;
};
