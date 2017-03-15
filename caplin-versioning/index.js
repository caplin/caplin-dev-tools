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

function getBranchDescriptor(defaultBranchName = "master") {
  const stdout = execSync("git rev-parse --abbrev-ref HEAD", execOptions);
  const currentBranch = stdout.trim();

  // To prevent a trailing `-` being suffixed to the version if a
  // `branchDescriptor` is available we prefix the descriptor with `-` if it
  // exists else return a blank string.
  return currentBranch === defaultBranchName ? "" : `-${currentBranch}`;
}

module.exports = (semVer, { hashLength, masterBranchName } = {}) => {
  const branchDescriptor = getBranchDescriptor(masterBranchName);
  const commitCount = getCommitCount();
  const hash = getHash(hashLength);

  return `${semVer}-${commitCount}-${hash}${branchDescriptor}`;
};
