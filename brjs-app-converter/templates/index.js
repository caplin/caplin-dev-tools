import 'mobile-default-aspect/themes/caplin/caplin-theme.scss';
import 'instrumentdetails/resources/en.properties';
import 'smspanel/resources/en.properties';
import 'connection/resources/en.properties';
import 'loginscreen/resources/en.properties';
import 'mobile-default-aspect/resources/en.properties';
import 'mobile-blotter/resources/i18n/en.properties';
import 'ui/resources/en.properties';
import 'mobile-authentication/resources/en.properties';
import 'tokenpanel/resources/en.properties';
import 'watchlist/resources/en.properties';
import App from 'mobile/App';

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

