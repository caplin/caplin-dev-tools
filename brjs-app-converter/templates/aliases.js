module.exports = {
	'caplin.config-service':{
		'class':'caplin/services/providers/CaplinConfigService',
		'className':'caplin.services.providers.CaplinConfigService',
		'interface':'caplin/services/ConfigService',
		'interfaceName':'caplin.services.ConfigService',

		get classRef() {
			return require("caplin/services/providers/CaplinConfigService");
		},

		get interfaceRef() {
			return require("caplin/services/ConfigService");
		}
	},
		'caplin.window-service':{
		'class':'caplin/popout/WindowService',
		'className':'caplin.popout.WindowService',

		get classRef() {
			return require("caplin/popout/WindowService");
		}
	},
		'utils.url':{
		'class':'utils/UrlParametersUtil',
		'className':'utils.UrlParametersUtil',

		get classRef() {
			return require("utils/UrlParametersUtil");
		}
	},
		'utils.window':{
		'class':'utils/WindowUtil',
		'className':'utils.WindowUtil',

		get classRef() {
			return require("utils/WindowUtil");
		}
	},
		'utils.version':{
		'class':'utils/VersionUtil',
		'className':'utils.VersionUtil',

		get classRef() {
			return require("utils/VersionUtil");
		}
	},
		'caplin.trade-service':{
		'class':'trading/service/MobileTradeService',
		'className':'trading.service.MobileTradeService',
		'interface':'caplin/trading/service/TradeService',
		'interfaceName':'caplin.trading.service.TradeService',

		get classRef() {
			return require("trading/service/MobileTradeService");
		},

		get interfaceRef() {
			return require("caplin/trading/service/TradeService");
		}
	},
		'caplin.trade-channel-mapper-service':{
		'interface':'caplin/trading/trademodel/TradeChannelMapper',
		'interfaceName':'caplin.trading.trademodel.TradeChannelMapper',

		get interfaceRef() {
			return require("caplin/trading/trademodel/TradeChannelMapper");
		}
	},
		'trading.validators.numeric':{
		'class':'trading/validators/NumericValidator',
		'className':'trading.validators.NumericValidator',

		get classRef() {
			return require("trading/validators/NumericValidator");
		}
	},
		'br.event-hub':{
		'class':'br/EventHub',
		'className':'br.EventHub',

		get classRef() {
			return require("br/EventHub");
		}
	},
		'utils.orientation':{
		'class':'utils/OrientationUtil',
		'className':'utils.OrientationUtil',

		get classRef() {
			return require("utils/OrientationUtil");
		}
	},
		'caplin.event-service':{
		'class':'caplin/core/event/EventHub',
		'className':'caplin.core.event.EventHub',

		get classRef() {
			return require("caplin/core/event/EventHub");
		}
	},
		'br.app-meta-service':{
		'class':'br/services/appmeta/BRAppMetaService',
		'className':'br.services.appmeta.BRAppMetaService',

		get classRef() {
			return require("br/services/appmeta/BRAppMetaService");
		}
	},
		'caplin.fx.tenor-service':{
		'class':'caplin/fx/tenor/TenorService',
		'className':'caplin.fx.tenor.TenorService',
		'interface':'caplin/fx/services/TenorService',
		'interfaceName':'caplin.fx.services.TenorService',

		get classRef() {
			return require("caplin/fx/tenor/TenorService");
		},

		get interfaceRef() {
			return require("caplin/fx/services/TenorService");
		}
	},
		'br.html-service':{
		'class':'br/services/html/BRHtmlResourceService',
		'className':'br.services.html.BRHtmlResourceService',

		get classRef() {
			const ConfigurableHTMLResourceService = require("ct-services/html/ConfigurableHTMLResourceService").default;

			require('./html-templates');

			return ConfigurableHTMLResourceService;
		}
	},
		'br.xml-service':{
		'class':'br/services/xml/BRXmlResourceService',
		'className':'br.services.xml.BRXmlResourceService',

		get classRef() {
			const ConfigurableXMLResourceService = require("ct-services/xml/ConfigurableXMLResourceService").default;

			require('./xml-documents');

			return ConfigurableXMLResourceService;
		}
	},
		'mobile.blotter.orders.bulk-order-state-manager':{
		'class':'mobile/blotter/screens/orders/bulk_orders/BulkOrderStateManager',
		'className':'mobile.blotter.screens.orders.bulk_orders.BulkOrderStateManager',

		get classRef() {
			return require("mobile/blotter/screens/orders/bulk_orders/BulkOrderStateManager");
		}
	},
		'caplin.fx.permission-service':{
		'class':'caplin/fx/permissioning/PermissionService',
		'className':'caplin.fx.permissioning.PermissionService',
		'interface':'caplin/trading/service/TradePermissionService',
		'interfaceName':'caplin.trading.service.TradePermissionService',

		get classRef() {
			return require("caplin/fx/permissioning/PermissionService");
		},

		get interfaceRef() {
			return require("caplin/trading/service/TradePermissionService");
		}
	},
		'caplin.user-service':{
		'class':'caplin/sljsadapter/providers/StreamLinkUserService',
		'className':'caplin.sljsadapter.providers.StreamLinkUserService',
		'interface':'caplin/services/UserService',
		'interfaceName':'caplin.services.UserService',

		get classRef() {
			return require("caplin/sljsadapter/providers/StreamLinkUserService");
		},

		get interfaceRef() {
			return require("caplin/services/UserService");
		}
	},
		'caplin.fx.tenor.currency-tenors':{
		'class':'caplin/fx/tenor/CurrencyTenors',
		'className':'caplin.fx.tenor.CurrencyTenors',

		get classRef() {
			return require("caplin/fx/tenor/CurrencyTenors");
		}
	},
		'authenticationService.authentication-service':{
		'class':'authenticationService/authenticationService',
		'className':'authenticationService.authenticationService',

		get classRef() {
			return require("authenticationService/authenticationService");
		}
	},
		'appcache.utility':{
		'class':'appcache/AppCacheUtility',
		'className':'appcache.AppCacheUtility',

		get classRef() {
			return require("appcache/AppCacheUtility");
		}
	},
		'caplin.fx.account-service':{
		'class':'caplin/fx/account/AccountService',
		'className':'caplin.fx.account.AccountService',

		get classRef() {
			return require("caplin/fx/account/AccountService");
		}
	},
		'caplin.preference-service':{
		'class':'caplin/services/testing/PreferencesServiceStub',
		'className':'caplin.services.testing.PreferencesServiceStub',
		'interface':'caplin/services/PreferencesService',
		'interfaceName':'caplin.services.PreferencesService',

		get classRef() {
			return require("caplin/services/testing/PreferencesServiceStub");
		},

		get interfaceRef() {
			return require("caplin/services/PreferencesService");
		}
	},
		'caplin.connection-service':{
		'class':'caplin/sljsadapter/providers/StreamLinkConnectionService',
		'className':'caplin.sljsadapter.providers.StreamLinkConnectionService',
		'interface':'caplin/services/ConnectionService',
		'interfaceName':'caplin.services.ConnectionService',

		get classRef() {
			return require("caplin/sljsadapter/providers/StreamLinkConnectionService");
		},

		get interfaceRef() {
			return require("caplin/services/ConnectionService");
		}
	},
		'caplin.fx.business-date-service':{
		'class':'caplin/fx/date/BusinessDateService',
		'className':'caplin.fx.date.BusinessDateService',
		'interface':'caplin/fx/services/BusinessDateService',
		'interfaceName':'caplin.fx.services.BusinessDateService',

		get classRef() {
			return require("caplin/fx/date/BusinessDateService");
		},

		get interfaceRef() {
			return require("caplin/fx/services/BusinessDateService");
		}
	},
		'caplin.message-service':{
		'class':'caplin/sljsadapter/providers/StreamLinkMessageService',
		'className':'caplin.sljsadapter.providers.StreamLinkMessageService',
		'interface':'caplin/services/messaging/MessageService',
		'interfaceName':'caplin.services.messaging.MessageService',

		get classRef() {
			return require("caplin/sljsadapter/providers/StreamLinkMessageService");
		},

		get interfaceRef() {
			return require("caplin/services/messaging/MessageService");
		}
	},
	'connection.service':{
		'class':'connection/ConnectionHandler',
		'className':'connection.ConnectionHandler',

		get classRef() {
			return require("connection/ConnectionHandler");
		}
	},
	'caplin.watchlist.watchlist-service':{
		'class':'caplin/sljsadapter/providers/StreamLinkWatchlistService',
		'className':'caplin.sljsadapter.providers.StreamLinkWatchlistService',
		'interface':'caplin/watchlist/WatchlistService',
		'interfaceName':'caplin.watchlist.WatchlistService',

		get classRef() {
			return require("caplin/sljsadapter/providers/StreamLinkWatchlistService");
		},

		get interfaceRef() {
			return require("caplin/watchlist/WatchlistService");
		}
	},
	'caplin.chart-service':{
		'class':'caplin/chart/service/StreamLinkChartService',
		'className':'caplin.chart.service.StreamLinkChartService',
		'interface':'caplin/chart/service/ChartService',
		'interfaceName':'caplin.chart.service.ChartService',

		get classRef() {
			return require("caplin/chart/service/StreamLinkChartService");
		},

		get interfaceRef() {
			return require("caplin/chart/service/ChartService");
		}
	},
	'caplin.trade-message-service':{
		'class':'caplin/trading/trademodel/CaplinTradeMessageService',
		'className':'caplin.trading.trademodel.CaplinTradeMessageService',
		'interface':'caplin/trading/trademodel/TradeMessageService',
		'interfaceName':'caplin.trading.trademodel.TradeMessageService',

		get classRef() {
			return require("caplin/trading/trademodel/CaplinTradeMessageService");
		},

		get interfaceRef() {
			return require("caplin/trading/trademodel/TradeMessageService");
		}
	},
	'caplin.permission-service':{
		'class':'caplin/sljsadapter/providers/StreamLinkPermissionService',
		'className':'caplin.sljsadapter.providers.StreamLinkPermissionService',
		'interface':'caplin/services/security/PermissionService',
		'interfaceName':'caplin.services.security.PermissionService',

		get classRef() {
			return require("caplin/sljsadapter/providers/StreamLinkPermissionService");
		},

		get interfaceRef() {
			return require("caplin/services/security/PermissionService");
		}
	},
	'fxtrading.rfqStatemachine.factory':{
		'class':'fxtrading/statemachine/FxRfqStateMachineFactory',
		'className':'fxtrading.statemachine.FxRfqStateMachineFactory',

		get classRef() {
			return require("fxtrading/statemachine/FxRfqStateMachineFactory");
		}
	},
	'fxtrading.orderStatemachine.factory':{
		'class':'fxtrading/statemachine/FxOrderStateMachineFactory',
		'className':'fxtrading.statemachine.FxOrderStateMachineFactory',

		get classRef() {
			return require("fxtrading/statemachine/FxOrderStateMachineFactory");
		}
	},
	'fxtrading.orderBulkStatemachine.factory':{
		'class':'fxtrading/statemachine/FxBulkOrderStateMachineFactory',
		'className':'fxtrading.statemachine.FxBulkOrderStateMachineFactory',

		get classRef() {
			return require("fxtrading/statemachine/FxBulkOrderStateMachineFactory");
		}
	},
	'fxtrading.statemachine.factory':{
		'class':'fxtrading/statemachine/FxStateMachineFactory',
		'className':'fxtrading.statemachine.FxStateMachineFactory',

		get classRef() {
			return require("fxtrading/statemachine/FxStateMachineFactory");
		}
	}
};
