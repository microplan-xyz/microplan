var program = require('commander')
var fs = require('fs-extra')
var path = require('path')
var templateFileLocation = {
  'yaml': 'parsers/yaml/template.yml',
  'json': 'parsers/json/template.json'
}

var _copyTemplateToPath = function (templateFilePath, destFilePath) {
  let sourcePath = ''
  try {
    fs.statSync(templateFilePath)
    sourcePath = templateFilePath
  } catch (err) {
    sourcePath = path.join(__dirname, templateFilePath)
  }
  initArgs.forEach(function (initArg) {
    try {
      fs.copySync(sourcePath, destFilePath)
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
  let type = path.extname(program.template)
  if (type !== '.yml' && type !== '.yaml' && type !== '.json') {
    console.error('Error : Please select proper template.')
    process.exit(1)
  }
  _copyTemplateToPath(program.template, initArgs[0])
}
