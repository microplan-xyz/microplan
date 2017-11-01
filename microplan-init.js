var program = require('commander')
var fs = require('fs-extra')
var path = require('path')
var utils = require('./utils/utils.js')
var async = require('async')
var readline = require('readline')

var templateFileLocation = {
  'yaml': 'parsers/yaml/template.yml',
  'json': 'parsers/json/template.json'
}

var suppFileExtns = ['.json', '.yml', '.yaml']
var userOptsYes = ['y', 'yes', 'Y', 'YES', 'Yes']

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async.waterfall([
  _parseInputFromUser,
  _getOptsFromUser,
  _copyTemplateFile
],
  function (err, result) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(result)
    process.exit(0)
  })

function _parseInputFromUser (callback) {
  program
    .option('-t, --template <location>', 'specify input template location', path.join(__dirname, templateFileLocation.yaml))
    .option('-d, --directory <location>', 'specify plan output directory')
    .parse(process.argv)

  if (program.args.length < 1) {
    callback('Please specify a valid filename for plan output.', null)
  }
  var destFilePath = program.args[0]

  if (utils.fileExists(program.template) === false) {
    callback('Please specify a valid template file location.', null)
  }

  var fileExt = path.extname(program.template)

  if (suppFileExtns.indexOf(fileExt) === -1) {
    callback('Template extension not supported. Please use supported file extensions: ' + suppFileExtns.join(', '), null)
  }

  if (program.directory) {
    if (utils.directoryExists(program.directory) === false) {
      callback('Please provide a valid directory path', null)
    }
    destFilePath = path.join(program.directory, destFilePath)
  }

  callback(null, program.template, destFilePath)
}

function _getOptsFromUser (templateFilePath, destFilePath, callback) {
  if (utils.fileExists(destFilePath)) {
    rl.question('File already exists. Do you want to overwrite this file? [N/y]', function (answer) {
      if (userOptsYes.indexOf(answer) === -1) {
        callback('Not overwriting the file: ' + destFilePath + '. Create plan file with new name and try again.', null)
      }
      callback(null, templateFilePath, destFilePath)
    })
  } else {
    callback(null, templateFilePath, destFilePath)
  }
}

function _copyTemplateFile (templateFilePath, destFilePath, callback) {
  try {
    fs.copySync(templateFilePath, destFilePath)
  } catch (err) {
    callback(err, 'Error copying to the file: ' + destFilePath)
  }
  callback(null, 'Plan file copied successfully: ' + destFilePath)
}
