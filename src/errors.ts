export const errors = {
  exportsRequired:
    "The `exports` or `bin` field is required. Please, verify the value. More info: https://nodejs.org/api/packages.html#package-entry-points",
  exportsInvalid:
    "The `exports` field must be a path to entrypoint. Please, verify the value. More info: https://nodejs.org/api/packages.html#package-entry-points",
  nameRequired:
    "The `name` field is required string. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name",
  nameMinLength:
    'Min length of "name" is 1 character. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name',
  nameMaxLength:
    'Max length of "name" is 214 characters. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name',
  nameStartsIllegalChars:
    "Name cannot start with `_` or `.` if it is not a scoped package. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name",
  versionRequired:
    "The `version` field is required string. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#version",
  privateIsTrue:
    "The `private` field must be `true` for avoiding accidental publish. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#private",
  descriptionString:
    "The `description` field must be a string. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#description",
  dependenciesInvalid:
    "The `dependencies` field must be an Object<string, string>. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#dependencies",
  binFiled:
    "The `bin` field must be a path or Record<string, FilePath>. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#bin",
  rollupError:
    "An error occurred while building the package. Please, report it to the issues on GitHub",
  typescriptNotFound:
    "The package.json contains typescript entrypoints, but the typescript package is not found. Please, install typescript@^5.0.0",
  optionalDependenciesInvalid:
    "The `optionalDependencies` field must be an Object<string, string>. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#optionaldependencies",
  repositoryInvalid:
    "The `repository` field must be an object with 'type' and 'url' properties or a string. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#repository",
  keywordsInvalid:
    "The `keywords` field must be an array of strings. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#keywords",
  authorInvalid:
    "The `author` field must be an object or a string. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#people-fields-author-contributors",
  contributorsInvalid:
    "The `contributors` field must be an array of objects or strings. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#people-fields-author-contributors",
  licenseInvalid:
    "The `license` field must be a string specifying the license. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#license",
  devDependenciesInvalid:
    "The `devDependencies` field must be an Object<string, string>. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#devdependencies",
  peerDependenciesInvalid:
    "The `peerDependencies` field must be an Object<string, string>. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies",
  enginesInvalid:
    "The `engines` field must be an object specifying version requirements. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#engines",
  browserInvalid:
    "The `browser` field must be a string or an object. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#browser",
  fundingInvalid:
    "The `funding` field must be an object or a string. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#funding",
  osInvalid:
    "The `os` field must be an array of strings. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#os",
  cpuInvalid:
    "The `cpu` field must be an array of strings. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#cpu",
};
