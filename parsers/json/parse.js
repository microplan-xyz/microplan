var fs = require('fs')

module.exports = function (filePath) {
  var err
  try {
    var parsed = require('filePath')
  } catch (e) {
    err = e
  }
  return {
    output: parsed,
    error: err
  }
}
