var program = require('commander')
var fs = require('fs-extra')
var path = require('path')
var templateFileLocation = 'init.template.yaml'

program
  .parse(process.argv)

var args = program.args

if (args.length > 1) {
  console.error('Filename required')
  process.exit(1)
}

args.forEach(function (arg) {
  try {
    fs.copySync(path.join(__dirname, templateFileLocation), arg)
  } catch (err) {
    console.error(err)
  }
  console.log('init: %s', arg)
})
