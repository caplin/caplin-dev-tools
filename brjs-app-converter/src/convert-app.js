import { readdirSync } from 'fs-extra';

import { moveAspectCode } from './convert-aspect';
import { moveAndConvertBladesCode, moveBladesetCode } from './convert-bladeset';

// Move all code in bladesets/blades/aspects into the packages directory.
export function moveBRJSApplicationCodeToPackages(conversionMetadata) {
  const brjsApplicationDir = conversionMetadata.brjsApplicationDir;
  const moveBRJSAppCodePromises = readdirSync(brjsApplicationDir).map(fileName => {
    if (/^.*-bladeset$/.test(fileName)) {
      return moveBladesetCode(conversionMetadata, fileName);
    } else if (/^.*-aspect$/.test(fileName)) {
      moveAspectCode(conversionMetadata, fileName);
    } else if (fileName === 'blades') {
      moveAndConvertBladesCode(brjsApplicationDir, '', conversionMetadata);
    }

    return Promise.resolve();
  });

  return Promise.all(moveBRJSAppCodePromises);
}
