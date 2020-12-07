function jsonToMap(jsonObj) {
  return new Map(Object.entries(jsonObj));
}

function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function duplicateKeyError(error, response, msg = '') {
  const responseMsg =
    msg || "The project name you've provided already exists. Please try again.";
  if (error.code === 11000) {
    return response.status(422).send(responseMsg);
  }
}

module.exports = {
  jsonToMap,
  isDevelopment,
  isProduction,
  duplicateKeyError,
};
