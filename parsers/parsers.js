var _ = require('underscore')

module.exports = (function () {
  var parsers = [
    {
      name: 'yaml',
      parse: require('./yaml/parse.js'),
      extensions: ['yml', 'yaml']
    }
  ]

  var parseFile = function (filePath) {
    var outputs = []
    _.each(parsers,
      function (parser) {
        var parsed = parser.parse(filePath)
        var fileExtension = filePath.split('.').pop()

        if (parsed.error && _.contains(parser.extensions, fileExtension)) {
          console.error('Error while parsing ' + parser.name)
          console.error(parsed.error)
        } else {
          outputs.push(parsed.output)
        }
      }
    )
    return outputs
  }

  return {
    parsers: parsers,
    parseFile: parseFile
  }
})()