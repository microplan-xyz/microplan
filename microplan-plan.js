var program = require('commander')
var yaml = require('js-yaml')
var fs = require('fs')
var path = require('path')

program
  .parse(process.argv)

var args = program.args

if (!args.length) {
  console.error('Filename required')
  process.exit(1)
}

if (program.force) console.log('  force: install')
args.forEach(function (arg) {
  // Get document, or throw exception on error
  try {
    var doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, arg), 'utf8'))
    console.log(doc)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
  console.log('init: %s', arg)
})
