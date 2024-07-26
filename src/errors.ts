export const errors = {
  mainRequired:
    "The `main` field is required string. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#main",
  mainInvalid:
    "The `main` field must be a path to entrypoint. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#main",
  nameRequired:
    "The `name` field is required string. Please, verify the value. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name",
  nameMinLength:
    'Min length of "name" is 1 character. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name',
  nameMaxLength:
    'Max length of "name" is 214 characters. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name',
  nameStartsIllegalChars:
    "Name cannot start with `_` or `.` if it is not a scoped package. More info: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name",
};
