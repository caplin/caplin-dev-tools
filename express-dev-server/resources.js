const { join } = require("path");

module.exports = (applicationName, application, appRoot) => {
  const defaultAspectPath = `src/${applicationName}-default-aspect`;
  const unbundledResourcesPath = `${defaultAspectPath}/unbundled-resources`;

  // Serve unbundled-resources requests from the default-aspect directory.
  application.get("/unbundled-resources/*", ({ params }, res) => {
    const resourcePath = `${unbundledResourcesPath}/${params["0"]}`;
    const absoluteResourcePath = join(appRoot, resourcePath);

    res.sendFile(absoluteResourcePath);
  });
};
