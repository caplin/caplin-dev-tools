CLI utility that runs UTs and ATs in older Caplin Solution applications.

Add -h to run the html reports, they will be created under reports-ATs and reports-UTs.

Add -c to run coverage stats, it'll build an html tree under coverage/html.

Add --keepCoverage To keep previous coverage runs. This allows them to combine

Add --includePackages To run tests on an apps dependencies

Add --includeCrossPackageCoverage To track coverage on files not related to the current packages/subfolder