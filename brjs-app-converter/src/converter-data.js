import {join} from 'path';

import {readFileSync} from 'fs-extra';
import template from 'lodash/string/template';

// These lodash template options set the `interpolate` delimiters to the older lodash delimiters.
// By default lodash supports these and the ES2015 delimiters i.e. `${}` which might be used in
// the template JS. We want to leave those as they are though so we set the delimiter omitting them.
const templateOptions = {interpolate: /<%= ([\s\S]+?) %>/};

export const templateDir = join(__dirname, '..', 'templates');

const appPackageJSONTemplate = readFileSync(join(templateDir, '_app-package.json'));
const brPkgPackageJSONTemplate = readFileSync(join(templateDir, '_brpkg-package.json'));
const thirdpartyPackageJSONTemplate = readFileSync(join(templateDir, '_thirdparty-package.json'));
const webpackConfigTemplate = readFileSync(join(templateDir, 'webpack.config.js'));

export const compiledAppPackageJSONTemplate = template(appPackageJSONTemplate);
export const compiledBRLibPackageJSONTemplate = template(brPkgPackageJSONTemplate);
export const compiledThirdpartyJSONTemplate = template(thirdpartyPackageJSONTemplate);
export const compiledWebpackConfigTemplate = template(webpackConfigTemplate, templateOptions);
