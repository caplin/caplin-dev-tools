/* eslint no-param-reassign: 0 */

const {
  basename
} = require("path");

// To remove the need to use webpack's `resolve.modules` config when symlinking
// packages set alias values to absolute paths. webpack searches for alias
// modules by working upward from the packages directory so the alias modules
// installed in an app's `node_modules` aren't found.
const aliasToModule = {
  "br.app-meta-service$": require.resolve(
    "@caplin/brjs-services/br.app-meta-service"
  ),
  "br.date-picker$": require.resolve("@caplin/brjs-aliases/br.date-picker"),
  "br.event-hub$": require.resolve("@caplin/brjs-aliases/br.event-hub"),
  "br.html-service$": require.resolve("@caplin/brjs-services/br.html-service"),
  "br.locale-provider$": require.resolve(
    "@caplin/brjs-services/br.locale-provider"
  ),
  "br.locale-service$": require.resolve(
    "@caplin/brjs-services/br.locale-service"
  ),
  "br.locale-switcher$": require.resolve(
    "@caplin/brjs-services/br.locale-switcher"
  ),
  "br.presenter-component$": require.resolve(
    "@caplin/brjs-aliases/br.presenter-component"
  ),
  "br.presenter.tooltip-helper$": require.resolve(
    "@caplin/brjs-aliases/br.presenter.tooltip-helper"
  ),
  "br.tooltip$": require.resolve("@caplin/brjs-aliases/br.tooltip"),
  "br.user-prompt-service$": require.resolve(
    "@caplin/brjs-services/br.user-prompt-service"
  ),
  "br.xml-service$": require.resolve("@caplin/brjs-services/br.xml-service"),
  "caplin.alerts.notification-service$": require.resolve(
    "@caplin/caplin-services/caplin.alerts.notification-service"
  ),
  "caplin.alerts.trigger-service$": require.resolve(
    "@caplin/caplin-services/caplin.alerts.trigger-service"
  ),
  "caplin.business-date-service$": require.resolve(
    "@caplin/caplin-services/caplin.business-date-service"
  ),
  "caplin.chart-ema-study$": require.resolve(
    "@caplin/caplin-aliases/caplin.chart-ema-study"
  ),
  "caplin.chart-macd-study$": require.resolve(
    "@caplin/caplin-aliases/caplin.chart-macd-study"
  ),
  "caplin.chart-sma-study$": require.resolve(
    "@caplin/caplin-aliases/caplin.chart-sma-study"
  ),
  "caplin.grid-component$": require.resolve(
    "@caplin/caplin-aliases/caplin.grid-component"
  ),
  "caplin.grid-drag-decorator$": require.resolve(
    "@caplin/caplin-aliases/caplin.grid-drag-decorator"
  ),
  "caplin.grid-drop-decorator$": require.resolve(
    "@caplin/caplin-aliases/caplin.grid-drop-decorator"
  ),
  "caplin.grid.refine.date-refine-component$": require.resolve(
    "@caplin/caplin-aliases/caplin.grid.refine.date-refine-component"
  ),
  "caplin.menu$": require.resolve("@caplin/caplin-aliases/caplin.menu"),
  "caplin.grid.refine.numeric-refine-component$": require.resolve(
    "@caplin/caplin-aliases/caplin.grid.refine.numeric-refine-component"
  ),
  "caplin.rttp-container-grid-data-provider$": require.resolve(
    "@caplin/caplin-aliases/caplin.rttp-container-grid-data-provider"
  ),
  "caplin.ui.input-control$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.input-control"
  ),
  "caplin.watchlist.watchlist-grid-data-provider$": require.resolve(
    "@caplin/caplin-aliases/caplin.watchlist.watchlist-grid-data-provider"
  ),
  "caplin.webcentric-proxy-component$": require.resolve(
    "@caplin/caplin-aliases/caplin.webcentric-proxy-component"
  ),
  "caplin.window-service$": require.resolve(
    "@caplin/caplin-services/caplin.window-service"
  ),
  "caplin.message-service$": require.resolve(
    "@caplin/caplin-services/caplin.message-service"
  ),
  "caplin.connection-service$": require.resolve(
    "@caplin/caplin-services/caplin.connection-service"
  ),
  "caplin.event-service$": require.resolve(
    "@caplin/caplin-services/caplin.event-service"
  ),
  "caplin.permission-service$": require.resolve(
    "@caplin/caplin-services/caplin.permission-service"
  ),
  "caplin.user-prompt-service$": require.resolve(
    "@caplin/caplin-services/caplin.user-prompt-service"
  ),
  "caplin.config-service$": require.resolve(
    "@caplin/caplin-services/caplin.config-service"
  ),
  "caplin.watchlist.watchlist-service$": require.resolve(
    "@caplin/caplin-services/caplin.watchlist.watchlist-service"
  ),
  "caplin.user-service$": require.resolve(
    "@caplin/caplin-services/caplin.user-service"
  ),
  "caplin.storage-service$": require.resolve(
    "@caplin/caplin-services/caplin.storage-service"
  ),
  "caplin.trade-service$": require.resolve(
    "@caplin/caplin-services/caplin.trade-service"
  ),
  "caplin.preference-service$": require.resolve(
    "@caplin/caplin-services/caplin.preference-service"
  ),
  "caplin.metals-service$": require.resolve(
    "@caplin/caplin-services/caplin.metals-service"
  ),
  "caplin.PopupManager$": require.resolve(
    "@caplin/caplin-services/caplin.PopupManager"
  ),
  "caplin.popout-service$": require.resolve(
    "@caplin/caplin-services/caplin.popout-service"
  ),
  "caplin.web-service-grid-data-provider$": require.resolve(
    "@caplin/caplin-services/caplin.web-service-grid-data-provider"
  ),
  "caplin.layout-service$": require.resolve(
    "@caplin/caplin-services/caplin.layout-service"
  ),
  "caplin.fx.confirmation$": require.resolve(
    "@caplin/caplin-fx-services/caplin.fx.confirmation"
  ),
  "caplin.ui.global-menu-control$": require.resolve(
    "@caplin/caplin-services/caplin.ui.global-menu-control"
  ),
  "caplin.xml-presenter-serializer$": require.resolve(
    "@caplin/caplin-services/caplin.xml-presenter-serializer"
  ),
  "caplin.fx.permission-service$": require.resolve(
    "@caplin/caplin-fx-services/caplin.fx.permission-service"
  ),
  "caplin.fx.account-service$": require.resolve(
    "@caplin/caplin-fx-services/caplin.fx.account-service"
  ),
  "caplin.fx.currency-pair-service$": require.resolve(
    "@caplin/caplin-fx-services/caplin.fx.currency-pair-service"
  ),
  "caplin.fx.tenor-service$": require.resolve(
    "@caplin/caplin-fx-services/caplin.fx.tenor-service"
  ),
  "caplin.trade-message-service$": require.resolve(
    "@caplin/caplin-services/caplin.trade-message-service"
  ),
  "caplin.trade-channel-mapper-service$": require.resolve(
    "@caplin/caplin-services/caplin.trade-channel-mapper-service"
  ),
  "caplin.trading.confirmation-service$": require.resolve(
    "@caplin/caplin-services/caplin.trading.confirmation-service"
  ),
  "caplin.fx.tenor.currency-tenors$": require.resolve(
    "@caplin/caplin-fx-aliases/caplin.fx.tenor.currency-tenors"
  ),
  "caplin.fx.business-date-service$": require.resolve(
    "@caplin/caplin-fx-services/caplin.fx.business-date-service"
  ),
  "caplin.tobo-user-service$": require.resolve(
    "@caplin/caplin-services/caplin.tobo-user-service"
  ),
  "caplin.fx.execute-button$": require.resolve(
    "@caplin/caplin-aliases/caplin.fx.execute-button"
  ),
  "caplin.keybindings.keybindings-service$": require.resolve(
    "@caplin/caplin-services/caplin.keybindings.keybindings-service"
  ),
  "caplin.trade-permission-service$": require.resolve(
    "@caplin/caplin-services/caplin.trade-permission-service"
  ),
  "caplin.workbench-trade-service$": require.resolve(
    "@caplin/caplin-services/caplin.workbench-trade-service"
  ),
  "caplin.grid-scroll-tip-decorator$": require.resolve(
    "@caplin/caplin-aliases/caplin.grid-scroll-tip-decorator"
  ),
  "caplin.ui.autocomplete-selection$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.autocomplete-selection"
  ),
  "caplin.ui.chosen-select-box-control$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.chosen-select-box-control"
  ),
  "caplin.column-resizing-decorator$": require.resolve(
    "@caplin/caplin-aliases/caplin.column-resizing-decorator"
  ),
  "caplin.column-reset-decorator$": require.resolve(
    "@caplin/caplin-aliases/caplin.column-reset-decorator"
  ),
  "caplin.row-loading-decorator$": require.resolve(
    "@caplin/caplin-aliases/caplin.row-loading-decorator"
  ),
  "caplin.availability.currency-pair-availability-service$": require.resolve(
    "@caplin/caplin-services/caplin.availability.currency-pair-availability-service"
  ),
  "caplin.availability.tenor-availability-service$": require.resolve(
    "@caplin/caplin-services/caplin.availability.tenor-availability-service"
  ),
  "caplin.ui.autocomplete-input$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.autocomplete-input"
  ),
  "caplin.sljs-container-grid-data-provider$": require.resolve(
    "@caplin/caplin-aliases/caplin.sljs-container-grid-data-provider"
  ),
  "caplin.column-header-menu-decorator$": require.resolve(
    "@caplin/caplin-aliases/caplin.column-header-menu-decorator"
  ),
  "caplin.grid-data-not-found-decorator$": require.resolve(
    "@caplin/caplin-aliases/caplin.grid-data-not-found-decorator"
  ),
  "caplin.ui.number-incrementor$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.number-incrementor"
  ),
  "caplin.ui.amount-control$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.amount-control"
  ),
  "caplin.lefty-layout$": require.resolve(
    "@caplin/caplin-aliases/caplin.lefty-layout"
  ),
  "caplin.column-reordering-decorator$": require.resolve(
    "@caplin/caplin-aliases/caplin.column-reordering-decorator"
  ),
  "caplin.ui.autocomplete-control$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.autocomplete-control"
  ),
  "caplin.ui.draggable-control$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.draggable-control"
  ),
  "caplin.ui.tooltip-control$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.tooltip-control"
  ),
  "caplin.fx.date-picker$": require.resolve(
    "@caplin/caplin-aliases/caplin.fx.date-picker"
  ),
  "caplin.menu.menu-control$": require.resolve(
    "@caplin/caplin-aliases/caplin.menu.menu-control"
  ),
  "caplin.ui.collapsible-control$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.collapsible-control"
  ),
  "caplin.ui.toggle-control$": require.resolve(
    "@caplin/caplin-aliases/caplin.ui.toggle-control"
  ),
  "caplin.motf.confirmation$": require.resolve(
    "@caplin/caplin-aliases/caplin.motf.confirmation"
  ),
  "caplin.motf.cancel$": require.resolve(
    "@caplin/caplin-aliases/caplin.motf.cancel"
  ),
  "caplin.motf.cancel.confirmation$": require.resolve(
    "@caplin/caplin-aliases/caplin.motf.cancel.confirmation"
  ),
  "caplin.grid.refine.text-refine-component$": require.resolve(
    "@caplin/caplin-aliases/caplin.grid.refine.text-refine-component"
  ),
  "caplinps.application-menu-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.application-menu-service"
  ),
  "caplinps.blottertabs.grid-data-row-highlight-decorator$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.blottertabs.grid-data-row-highlight-decorator"
  ),
  "caplinps.blottertabs.tab-control$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.blottertabs.tab-control"
  ),
  "caplinps.blottertabs.blotter-creation-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.blottertabs.blotter-creation-service"
  ),
  "caplinps.blottertabs.blotter-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.blottertabs.blotter-service"
  ),
  "caplinps.blottertabs.tab-control-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.blottertabs.tab-control-service"
  ),
  "caplinps.blottertabs.tabbed-blotter$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.blottertabs.tabbed-blotter"
  ),
  "caplinps.clientsearch.clientSearchFactory$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.clientsearch.clientSearchFactory"
  ),
  "caplinps.collapsible-menu-model$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.collapsible-menu-model"
  ),
  "caplinps.component-lifecycle-workbench-tool$": require.resolve(
    "@caplin/caplinps-services/caplinps.component-lifecycle-workbench-tool"
  ),
  "caplinps.config-workbench-tool$": require.resolve(
    "@caplin/caplinps-services/caplinps.config-workbench-tool"
  ),
  "caplinps.fx.confirmation$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.fx.confirmation"
  ),
  "caplinps.fx.tile.factory$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.fx.tile.factory"
  ),
  "caplinps.fx.execution.floating-tooltip$": require.resolve(
    "@caplin/caplinps-services/caplinps.fx.execution.floating-tooltip"
  ),
  "caplinps.fx.tile.shield$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.fx.tile.shield"
  ),
  "caplinps.fx.execution.fx-date-picker$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.fx.execution.fx-date-picker"
  ),
  "caplinps.grid.date-refine-component$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.grid.date-refine-component"
  ),
  "caplinps.grid.date-time-refine-component$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.grid.date-time-refine-component"
  ),
  "caplinps.grid.toolbar-decorator$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.grid.toolbar-decorator"
  ),
  "caplinps.grid.toolbar-component$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.grid.toolbar-component"
  ),
  "caplinps.grid.numeric-refine-component$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.grid.numeric-refine-component"
  ),
  "caplinps.logging.activity-log-store$": require.resolve(
    "@caplin/caplinps-services/caplinps.logging.activity-log-store"
  ),
  "caplinps.messaging-workbench-tool$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.messaging-workbench-tool"
  ),
  "caplinps.ministatemodelvisualiser-workbench-tool$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.ministatemodelvisualiser-workbench-tool"
  ),
  "caplinps.menu-selectable-item-model$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.menu-selectable-item-model"
  ),
  "caplinps.permissioning-workbench-tool$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.permissioning-workbench-tool"
  ),
  "caplinps.permissioned-menu-item-model$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.permissioned-menu-item-model"
  ),
  "caplinps.shared-message-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.shared-message-service"
  ),
  "caplinps.tabs.tab-menu-control$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.tabs.tab-menu-control"
  ),
  "caplinps.tobo.account-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.tobo.account-service"
  ),
  "caplinps.tobo.multiple-user-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.tobo.multiple-user-service"
  ),
  "caplinps.tobo.recentusers.recent-users-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.tobo.recentusers.recent-users-service"
  ),
  "caplinps.tobo.search-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.tobo.search-service"
  ),
  "caplinps.tobo.grid.dataprovider.sljs-tobo-container-grid-data-provider$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.tobo.grid.dataprovider.sljs-tobo-container-grid-data-provider"
  ),
  "caplinps.tradechannelstatus-workbench-tool$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.tradechannelstatus-workbench-tool"
  ),
  "caplinps.ui.dialog.dialog-manager$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.ui.dialog.dialog-manager"
  ),
  "caplinps.userpreferences.user-preferences-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.userpreferences.user-preferences-service"
  ),
  "caplinps.ui.dialog.default-layout-handler$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.ui.dialog.default-layout-handler"
  ),
  "caplinps.watchlists.watchlist-sub-menu-model$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.watchlists.watchlist-sub-menu-model"
  ),
  "caplinps.watchlists.toolbar-component$": require.resolve(
    "@caplin/caplinps-aliases/caplinps.watchlists.toolbar-component"
  ),
  "caplinps.workbench-component-lifecycle-service$": require.resolve(
    "@caplin/caplinps-services/caplinps.workbench-component-lifecycle-service"
  ),
  "caplinps.workbench-trade-service-listener$": require.resolve(
    "@caplin/caplinps-services/caplinps.workbench-trade-service-listener"
  ),
  "caplinx.fxtrader.tile.trade-tile$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.fxtrader.tile.trade-tile"
  ),
  "caplinx.motf.orderticket.indicative-rate$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.motf.orderticket.indicative-rate"
  ),
  "caplinx.motf.motfticket.motf-trade-factory$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.motf.motfticket.motf-trade-factory"
  ),
  "caplinx.scaffold.searchbutton.search-button$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.scaffold.searchbutton.search-button"
  ),
  "caplinx.tilecontainer.tradertilecontainer-component$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.tilecontainer.tradertilecontainer-component"
  ),
  "caplinx.scaffold.newtradebutton.new-trade-button$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.scaffold.newtradebutton.new-trade-button"
  ),
  "caplinx.rates.accountselector.service$": require.resolve(
    "@caplin/caplinx-services/caplinx.rates.accountselector.service"
  ),
  "caplinx.scaffold.loadingscreen.loadingscreen$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.scaffold.loadingscreen.loadingscreen"
  ),
  "caplinx.users.clientsearch.client-search$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.users.clientsearch.client-search"
  ),
  "caplinx.scaffold.userinfo.user-name$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.scaffold.userinfo.user-name"
  ),
  "caplinx.users.clientsearch.client-search-control$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.users.clientsearch.client-search-control"
  ),
  "caplinx.tilecontainer.clienttilecontainer-component$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.tilecontainer.clienttilecontainer-component"
  ),
  "caplinx.tilecontainer.ordertilecontainer-component$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.tilecontainer.ordertilecontainer-component"
  ),
  "caplinx.users.recentusers.recentusers-component$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.users.recentusers.recentusers-component"
  ),
  "caplinx.scaffold.sidemenu.sidemenu-component$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.scaffold.sidemenu.sidemenu-component"
  ),
  "caplinx.fxexecution.tilelayout.tile-set$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.fxexecution.tilelayout.tile-set"
  ),
  "caplinx.fxexecution.tilelayout.tilesframe$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.fxexecution.tilelayout.tilesframe"
  ),
  "caplinx.watchlists.fxwatchlists.watchlist-component$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.watchlists.fxwatchlists.watchlist-component"
  ),
  "caplinx.motf.motfticket.motf-ticket$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.motf.motfticket.motf-ticket"
  ),
  "caplinx.motf.clientinfo.component$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.motf.clientinfo.component"
  ),
  "caplinx.dockingpanel.user-container-manager$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.dockingpanel.user-container-manager"
  ),
  "caplinx.motf.orderticket.component$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.motf.orderticket.component"
  ),
  "caplinx.motf.motfticket.amend-trade-factory$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.motf.motfticket.amend-trade-factory"
  ),
  "caplinx.fxblotters.orders.bulk-action-blotter-launcher$": require.resolve(
    "@caplin/caplinx-services/caplinx.fxblotters.orders.bulk-action-blotter-launcher"
  ),
  "caplinx.fxblotters.orders.bulk-order-state-manager$": require.resolve(
    "@caplin/caplinx-services/caplinx.fxblotters.orders.bulk-order-state-manager"
  ),
  "caplinx.fxblotters.orders.order-action-allowed-service$": require.resolve(
    "@caplin/caplinx-services/caplinx.fxblotters.orders.order-action-allowed-service"
  ),
  "caplinx.fxblotters.orders.order-actions-menu-service$": require.resolve(
    "@caplin/caplinx-services/caplinx.fxblotters.orders.order-actions-menu-service"
  ),
  "caplinx.fxblotters.orders.order-state-manager$": require.resolve(
    "@caplin/caplinx-services/caplinx.fxblotters.orders.order-state-manager"
  ),
  "caplinx.dockingpanel.dockingpanel-component$": require.resolve(
    "@caplin/caplinx-aliases/caplinx.dockingpanel.dockingpanel-component"
  ),
  "caplinx.dockedcontainer.docked-container-service$": require.resolve(
    "@caplin/caplinx-services/caplinx.dockedcontainer.docked-container-service"
  )
};

module.exports.configureAliases = function configureAliases(
  aliases,
  webpackConfig,
  testAliases = aliases,
  webpackAppAliases = {}
) {
  const lifeCycleEvent = process.env.npm_lifecycle_event || "";
  const isTest = basename(process.argv[1]) === "tests.js" ||
    lifeCycleEvent.startsWith("test");
  const aliasesToUse = isTest ? testAliases : aliases;

  // Attach the AliasRegistry aliases to the app's webpack aliases.
  Object.keys(aliasesToUse).forEach(alias => {
    const exactMatchAlias = `${alias}$`;
    const moduleToAlias = aliasToModule[exactMatchAlias];

    if (moduleToAlias) {
      webpackAppAliases[exactMatchAlias] = moduleToAlias;
    }
  });

  // Attach the app aliases to the webpack default config ones.
  Object.assign(webpackConfig.resolve.alias, webpackAppAliases);
};
