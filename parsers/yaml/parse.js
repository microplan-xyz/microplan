var yaml = require('js-yaml')
var fs = require('fs')

module.exports = function (filePath) {
  var err;
  try {
    var parsed = yaml.safeLoad(
      fs.readFileSync(
        filePath,
        'utf8'
        )
      )
  } catch (e) {
    err = e
  }
  return {
    output: parsed,
    error: err
  }
}