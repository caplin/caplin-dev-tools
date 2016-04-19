// require all modules ending in '_test' from the
// current directory and all subdirectories
const instrumentDetailsTestsContext = require.context('./node_modules/instrumentdetails/_test-ut', true, /.*\.js$/);
const mobileBlotterTestsContext = require.context('./node_modules/mobile-blotter/_test-ut', true, /.*\.js$/);
const uiTestsContext = require.context('./node_modules/ui/_test-ut', true, /.*\.js$/);
const watchlistTestsContext = require.context('./node_modules/watchlist/_test-ut', true, /.*\.js$/);

instrumentDetailsTestsContext.keys().forEach(instrumentDetailsTestsContext);
mobileBlotterTestsContext.keys().forEach(mobileBlotterTestsContext);
uiTestsContext.keys().forEach(uiTestsContext);
watchlistTestsContext.keys().forEach(watchlistTestsContext);
