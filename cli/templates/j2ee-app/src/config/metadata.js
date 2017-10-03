const APP_VERSION = process.env.VERSION || "dev";

module.exports = {
  APP_VERSION,
  VERSIONED_BUNDLE_PATH: `static/${APP_VERSION}`,
  LOCALE_COOKIE_NAME: "BRJS.LOCALE",
  APP_LOCALES: {
    en: true
  }
};
