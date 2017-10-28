var program = require('commander')
var fs = require('fs-extra')
var path = require('path')
var utils = require('./utils/utils.js')

var templateFileLocation = {
  'yaml': 'parsers/yaml/template.yml',
  'json': 'parsers/json/template.json'
}

var suppFileExtns = ['.json', '.yml', '.yaml']

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
  .option('-t, --template <location>', 'specify input template location', templateFileLocation.yaml)
  .parse(process.argv)

var initArgs = program.args

if (initArgs.length > 1) {
  console.error('Filename required. Please specify a valid', suppFileExtns.join('/'), 'template location as argument.')
  process.exit(1)
}

if (utils.fileExists(program.template) === false) {
  console.error('Please specify a valid', suppFileExtns.join('/'), 'template file location.')
  process.exit(1)
}

let fileExt = path.extname(program.template)

if (suppFileExtns.indexOf(fileExt) === -1) {
  console.error('File extension not supported. Please use supported file extensions: ' + suppFileExtns.join(', '))
  process.exit(1)
}

_copyTemplateToPath(program.template, initArgs[0])
