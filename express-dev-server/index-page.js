const { join } = require("path");

const session = require("express-session");

const injectJNDITokens = require("./jndi");

function indexRequestHandler(indexPage, res) {
  const indexPageHTMLWithInjectedJNDI = injectJNDITokens(indexPage());

  res.send(indexPageHTMLWithInjectedJNDI);
}

module.exports = (application, indexPage, routePath = "/") => {
  application.get(routePath, (req, res) => indexRequestHandler(indexPage, res));
};

module.exports.loginProtectedIndexPage = ({ app, appRoot, indexPage }) => {
  // You must register the `express-session` middleware before you register the
  // handlers for `/login` and `/j_security_check` as otherwise the session data
  // is not provided to the handlers.
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: "keyboard cat"
    })
  );

  app.use((req, res, next) => {
    if (req.session.loggedIn === undefined) {
      req.session.loggedIn = false;
    }

    next();
  });

  app.get("/", (req, res) => {
    const sess = req.session;

    if (sess.loggedIn === false) {
      res.redirect("/login");
    } else {
      indexRequestHandler(indexPage, res);
    }
  });

  app.get("/login", (req, res) => {
    res.sendFile(join(appRoot, "/server/java/login/index.html"));
  });

  app.post("/j_security_check", (req, res) => {
    req.session.loggedIn = true;

    res.redirect("/");
  });
};
