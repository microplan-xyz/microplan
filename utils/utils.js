var fs = require('fs')

var parseSlug = function (slug) {
  var result = {
    namespace: null,
    project: null
  }
  try {
    result.namespace = slug.split('/')[0]
    result.project = slug.split('/')[1]
  } catch (err) {
    return result
  }
  return result
}

function fileExists (filePath) {
  try {
    return fs.statSync(filePath).isFile()
  } catch (err) {
    return false
  }
}

module.exports =
{
  fileExists: fileExists,
  parseSlug: parseSlug
}
