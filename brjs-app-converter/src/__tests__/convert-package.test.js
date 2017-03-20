const test = require("ava");

const { createRelativeModuleSource } = require("../convert-packages");

test("test", execObj => {
  const relativeModuleSource = createRelativeModuleSource(
    "apps/mobile/src/config/aliases.js",
    "/apps/mobile/src/",
    "mobile-blotter/screens/orders/bulk_orders/BulkOrderStateManager"
  );

  execObj.is(
    relativeModuleSource,
    "../mobile-blotter/screens/orders/bulk_orders/BulkOrderStateManager"
  );
});

test("test 2", execObj => {
  const relativeModuleSource = createRelativeModuleSource(
    "packages/watchlist/test-unit/tests/WatchlistScreenTest.js",
    "/packages/",
    "watchlist/WatchlistScreen"
  );

  execObj.is(relativeModuleSource, "../../WatchlistScreen");
});

test("test 3", execObj => {
  const relativeModuleSource = createRelativeModuleSource(
    "packages/mobile-default-aspect/ui/TabletView.js",
    "/packages/",
    "watchlist/WatchlistScreenManager"
  );

  execObj.is(relativeModuleSource, "../../watchlist/WatchlistScreenManager");
});

test("test 4", execObj => {
  const relativeModuleSource = createRelativeModuleSource(
    "packages/mobile-blotter/BlotterFactories.js",
    "/packages/",
    "mobile-blotter/screens/trades/TradeBlotterBlock"
  );

  execObj.is(relativeModuleSource, "./screens/trades/TradeBlotterBlock");
});

test("test 5", execObj => {
  const relativeModuleSource = createRelativeModuleSource(
    "packages/instrumentdetails/_test-at/orders/OrderTicketATs.js",
    "/packages/",
    "instrumentdetails/src-test/OrderTicketHandler"
  );

  execObj.is(relativeModuleSource, "../../src-test/OrderTicketHandler");
});
