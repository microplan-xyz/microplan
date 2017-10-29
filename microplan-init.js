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
    .option('-t, --template <location>', 'specify input template location', templateFileLocation.yaml)
    .parse(process.argv)

  var initArgs = program.args

  if (initArgs.length < 1) {
    callback('Filename required. Please specify a valid' + suppFileExtns.join('/') + 'template location as argument.', null)
  }

  if (utils.fileExists(program.template) === false) {
    callback('Please specify a valid' + suppFileExtns.join('/') + 'template file location.', null)
  }

  let fileExt = path.extname(program.template)

  if (suppFileExtns.indexOf(fileExt) === -1) {
    callback('File extension not supported. Please use supported file extensions: ' + suppFileExtns.join(', '), null)
  } else {
    callback(null, program.template, initArgs)
  }
}

function _getOptsFromUser (templateFilePath, initArgs, callback) {
  var destFilePath = initArgs[0]
  if (utils.fileExists(destFilePath)) {
    rl.question('File already exists. Do you want to overwrite this file? [N/y]', function (answer) {
      if (userOptsYes.indexOf(answer) === -1) {
        callback('Not overwriting the file: ' + destFilePath + '. Create plan file with new name and try again.', null)
      }
      callback(null, templateFilePath, initArgs)
    })
  } else {
    callback(null, templateFilePath, initArgs)
  }
}

function _copyTemplateFile (templateFilePath, initArgs, callback) {
  var destFilePath = initArgs[0]
  initArgs.forEach(function (initArg) {
    try {
      fs.copySync(templateFilePath, destFilePath)
    } catch (err) {
      callback(err, 'Error copying to the file: ' + destFilePath)
    }
    callback(null, 'Plan file copied successfully: ' + destFilePath)
  })
}
