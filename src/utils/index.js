function jsonToMap(jsonObj) {
  return new Map(Object.entries(jsonObj));
}

module.exports = {
  jsonToMap,
};
