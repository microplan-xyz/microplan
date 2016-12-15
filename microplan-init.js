var program = require('commander')
var fs = require('fs-extra')
var path = require('path')
var templateFileLocation = {
  'yaml': 'parsers/yaml/template.yml',
  'json': 'parsers/json/template.json'
}

var _copyTemplateToPath = function (templateFilePath, destFilePath) {
  initArgs.forEach(function (initArg) {
    try {
      fs.copySync(path.join(__dirname, templateFilePath), destFilePath)
    } catch (err) {
      console.error(err)
    }
    console.log('init: %s', destFilePath)
  })
}
program
  .option('-t, --template <type>', 'specify input template (json|yaml) [yaml]', 'yaml')
  .parse(process.argv)

var initArgs = program.args

if (initArgs.length > 1) {
  console.error('Filename required')
  process.exit(1)
}

if (program.template === 'yaml') {
  _copyTemplateToPath(templateFileLocation.yaml, initArgs[0])
} else if (program.template === 'json') {
  _copyTemplateToPath(templateFileLocation.json, initArgs[0])
} else {
  console.error('Error : Please select proper template.')
  process.exit(1)
}
