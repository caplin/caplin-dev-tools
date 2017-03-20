import { join } from "path";

import { copySync } from "fs-extra";

import { createNamespaceDirectoriesIfMissing } from "./converter-utils";

// Move a blade to the packages directory.
export function moveBladeCodeToPackages(
  bladeName,
  bladesetName,
  bladesetBladesDir,
  conversionMetadata
) {
  const { applicationNamespaceRoot, packagesDir } = conversionMetadata;
  const bladeDir = join(bladesetBladesDir, bladeName);
  const bladePackageDir = join(packagesDir, bladeName);
  const bladeNamespaceDir = join(
    bladePackageDir,
    "src",
    applicationNamespaceRoot,
    bladesetName,
    bladeName
  );

  copySync(bladeDir, bladePackageDir);

  return createNamespaceDirectoriesIfMissing(
    bladeNamespaceDir,
    bladePackageDir
  );
}
