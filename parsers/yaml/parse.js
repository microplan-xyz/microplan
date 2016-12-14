var yaml = require('js-yaml')
var fs = require('fs')

module.exports = function (filePath) {
  var err
  try {
    var parsed = yaml.safeLoad(
      fs.readFileSync(
        filePath,
        'utf8'
        )
      )
      console.log(parsed)
      console.log('---------------------')
      console.log()
  } catch (e) {
    err = e
  }
  return {
    output: parsed,
    error: err
  }
}
