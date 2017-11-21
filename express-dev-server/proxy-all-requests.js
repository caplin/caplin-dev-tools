const proxyFactory = require("./proxy-factory");
const proxyTargetFactory = require("./proxy-target-factory");

module.exports = (application, { args, cmd, host, port } = {}) => {
  proxyTargetFactory({ args, cmd });

  const proxy = proxyFactory({ host, port });

  function proxyRequest(req, res) {
    proxy.web(req, res);
  }

  application.use(proxyRequest);
};
