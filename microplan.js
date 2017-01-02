#!/usr/bin/env node
var program = require('commander')

var packageJson = require('./package.json')

program
  .version(packageJson.version)
  .command('init [filename]', 'initialise file with template')
  .command('publish [filename]', 'publish the microservice')
  .command('login', 'login and save the credentials')
  .parse(process.argv)

if (!program.args.length) {
  program.help()
}
