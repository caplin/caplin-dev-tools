'use strict';

const aliasesConfig = require('./aliases');

Object.defineProperty(
	aliasesConfig['caplin.connection-service'],
	'classRef', {
		get: function() {
			return require('caplin/services/testing/ConnectionServiceStub');
		}
	}
);

Object.defineProperty(
	aliasesConfig['caplin.permission-service'],
	'classRef', {
		get: function() {
			return require('caplinps/services/testing/PermissionServiceStub');
		}
	}
);

Object.defineProperty(
	aliasesConfig['caplin.trade-service'],
	'classRef', {
		get: function() {
			return require('utils/TradeServiceStub');
		}
	}
);

Object.defineProperty(
	aliasesConfig['caplin.watchlist.watchlist-service'],
	'classRef', {
		get: function() {
			return require('caplin/watchlist/testing/WatchlistServiceStub');
		}
	}
);

// DummyAppConfig doesn't implement the Config Service interface. `delete` as the getters don't have setters.
delete aliasesConfig['caplin.config-service']['interface'];
delete aliasesConfig['caplin.config-service'].interfaceRef;
Object.defineProperty(
	aliasesConfig['caplin.config-service'],
	'classRef', {
		get: function() {
			return require('appConfig/DummyAppConfig');
		}
	}
);

aliasesConfig['lib.currency-service'] = {
	'class': 'currencyService/CurrencyService',

	get classRef() {
		return require('currencyService/StubCurrencyService');
	}
};

module.exports = aliasesConfig;
