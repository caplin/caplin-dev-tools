const VERSION = '1.0.0';

module.exports = {
	APP_VERSION: process.env.NODE_ENV === 'production' ? VERSION : 'dev',
	VERSIONED_BUNDLE_PATH: 'v/dev',
	LOCALE_COOKIE_NAME: 'BRJS.LOCALE',
	APP_LOCALES: {
		en: true
	}
};
