#!/usr/bin/env node
var program = require('commander')

program
  .version('0.0.1')
  .command('init [filename]', 'initialise file with template', {isDefault: 'template'})
  .command('plan [filename]', 'plan the microservice')
  .command('publish [filename]', 'publish the microservice')
  .command('login <credentials> <1.github /2.gitlab>', 'login and save the credentials')
  .parse(process.argv)
