var program = require('commander')

program
  .parse(process.argv)

var args = program.args

if (!args.length) {
  console.error('Filename required')
  process.exit(1)
}

if (program.force) console.log('  force: install')
args.forEach(function (arg) {
  console.log('init: %s', arg)
})
