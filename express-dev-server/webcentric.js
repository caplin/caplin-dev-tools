module.exports = (application, proxy) => {
  function proxyRequest(req, res) {
    proxy.web(req, res);
  }

  application.get("/servlet/webcentric/*", proxyRequest);
  application.post("/servlet/webcentric/*", proxyRequest);
};
