/**
 * @description converts the given object to environment string. That string is then returned as a Binary Buffer.
 * @param {Object<string, any>} objectToConvert  - Plain Old Javascript Object to convert to environment string
 * @returns A binary buffer containing the environment string
 *
 */
module.exports = function main(objectToConvert) {
  let envString = Object.entries(objectToConvert)
    .flatMap((x) => x.join('='))
    .join('\n');
  return Buffer.from(envString, 'binary');
};
