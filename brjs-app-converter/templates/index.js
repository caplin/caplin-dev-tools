import 'mobile-default-aspect/themes/caplin/caplin-theme.scss';
import 'instrumentdetails/_resources/en.properties';
import 'smspanel/_resources/en.properties';
import 'connection/_resources/en.properties';
import 'loginscreen/_resources/en.properties';
import 'mobile-default-aspect/_resources/en.properties';
import 'mobile-blotter/_resources/i18n/en.properties';
import 'ui/_resources/en.properties';
import 'mobile-authentication/_resources/en.properties';
import 'tokenpanel/_resources/en.properties';
import 'watchlist/_resources/en.properties';
import App from 'mobile-default-aspect/App';

const JNDITokenMap = {
	'LIBERATOR.PRIMARY.ADDRESS': '172.20.0.82',
	'LIBERATOR.PRIMARY.PORT': '18080',
	'LIBERATOR.PRIMARY.HTTPS.PORT': '18081',
	'LIBERATOR.SECONDARY.ADDRESS': '172.20.0.82',
	'LIBERATOR.SECONDARY.PORT': '18080',
	'LIBERATOR.SECONDARY.HTTPS.PORT': '18081',
	'KEYMASTER.LOCATION': 'servlet/StandardKeyMaster',
	'CAPLIN.DEV.MODE': 'true',
	'SESSION.POLL.LOCATION': 'servlet/Poll'
};

(new App()).initialise(JNDITokenMap); // eslint-disable-line
