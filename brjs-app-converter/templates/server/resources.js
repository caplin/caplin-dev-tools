import {join} from 'path';

export default (applicationPath, application, appRoot) => {
	const applicatioAspectPrefix = `node_modules${applicationPath}-`;

	// Serve up aspect based resources from `node_modules`.
	application.get('/v/dev/cssresource/aspect_:aspect/theme_:theme/*', ({params}, res) => {
		const {aspect, theme} = params;
		const resourcePath = `${applicatioAspectPrefix}${aspect}-aspect/themes/${theme}/${params['0']}`;
		const absResourcePath = join(appRoot, resourcePath);

		res.sendFile(absResourcePath);
	});

	// Serve up the default aspect unbundled-resources from `node_modules`.
	application.get('/unbundled-resources/*', ({params}, res) => {
		const resourcePath = `${applicatioAspectPrefix}default-aspect/unbundled-resources/${params['0']}`;
		const absResourcePath = join(appRoot, resourcePath);

		res.sendFile(absResourcePath);
	});
};
