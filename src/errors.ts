export const errors = {
  exportsRequired:
    "The `exports` field is required string. Please, verify the value. More info: https://nodejs.org/api/packages.html#package-entry-points",
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
};
