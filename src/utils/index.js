function jsonToMap(jsonObj) {
  return new Map(Object.entries(jsonObj));
}

function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

module.exports = {
  jsonToMap,
  isDevelopment,
  isProduction,
};
