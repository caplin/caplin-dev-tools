import {
	join
} from 'path';

import {
	readFileSync
} from 'fs-extra';
import template from 'lodash/string/template';

export const templateDir = join(__dirname, '..', 'templates');

const brPkgPackageJSONTemplate = readFileSync(join(templateDir, '_brpkg-package.json'));
const thirdpartyPackageJSONTemplate = readFileSync(join(templateDir, '_thirdparty-package.json'));

export const compiledBRLibPackageJSONTemplate = template(brPkgPackageJSONTemplate);
export const compiledThirdpartyJSONTemplate = template(thirdpartyPackageJSONTemplate);
