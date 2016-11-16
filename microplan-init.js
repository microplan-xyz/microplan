var program = require('commander')
var fs = require('fs-extra')
var path = require('path')
var templateFileLocation = 'init.template.yaml'

program
  .parse(process.argv)

var initArgs = program.args

if (initArgs.length > 1) {
  console.error('Filename required')
  process.exit(1)
}

initArgs.forEach(function (initArg) {
  try {
    fs.copySync(path.join(__dirname, templateFileLocation), initArg)
  } catch (err) {
    console.error(err)
  }
  console.log('init: %s', initArg)
})
