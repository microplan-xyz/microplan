var program = require('commander')
var fs = require('fs-extra')
var path = require('path')
var homeDir = require('home-dir')
var credentialsLocation = '.microplan'

program
  .parse(process.argv)

var loginArgs = program.args

if (loginArgs.length > 2) {
  console.error('Credentials required')
  process.exit(1)
}

try {
  fs.writeFile(path.join(homeDir(), credentialsLocation), loginArgs[0], function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('The credentials was saved at ' + homeDir())
  })
} catch (err) {
  console.error(err)
}

console.log('loginArgs: ', loginArgs[1])
// args[1] has the
