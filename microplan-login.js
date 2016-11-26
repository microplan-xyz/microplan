var program = require('commander')
var fs = require('fs-extra')
var path = require('path')
var homeDir = require('home-dir')
var credentialsLocation = '.microplan'
var _ = require('underscore')
var readline = require('readline')
var util = require('util')
var publishers = require('./publishers/publishers.js')
var async = require('async')

program
  .parse(process.argv)

var loginArgs = program.args

if (loginArgs.length > 2) {
  console.error('Credentials required')
  process.exit(1)
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var loginQuestion = 'Available publishers to log into : '
var pubMap = []
var pubIndex = 0
_.each(
  publishers,
  function (pub, pubKey) {
    var count = pubIndex + 1
    pubMap[count] = {
      type: pubKey,
      config: pub
    }
    loginQuestion += util.format('\n\t%s. %s', count, pubKey)
    pubIndex++
  }
)
loginQuestion += '\nPlease choose publisher to login : '

rl.question(loginQuestion,
  function (answer) {
    var publisher
    try {
      var optionAsNumber
      optionAsNumber = parseInt(answer)
      publisher = pubMap[optionAsNumber]
      if (_.isEmpty(publisher)) {
        throw new Error('Publisher Not Found')
      }
    } catch (ex) {
      console.error('Invalid choice.')
      process.exit(1)
    }

    var optQues = _.map(publisher.config.loginOpts,
      function (opt) {
        return function (auth, nextQuestion) {
          rl.question(
            util.format('%s %s ? ', publisher.type, opt.optName),
            function (optAns) {
              auth.loginOpts.push({
                optName: opt.optName,
                answer: optAns
              })
              nextQuestion(null, auth)
            }
          )
        }
      }
    )

    optQues.unshift(
      function (callback) {
        // initialize auth object for collecting option values from users
        var auth = {
          type: publisher.type,
          loginOpts: []
        }
        callback(null, auth)
      }
    )

    async.waterfall(
      optQues.concat([
        getExistingPublisherCredentials,
        writePublisherCredentials
      ]),
      function (err) {
        if (err) {
          console.error(err)
          process.exit(1)
        }

        process.exit(0)
      }
    )
  }
)

function getExistingPublisherCredentials (newPublisherCreds, callback) {
  var publisherCredentials
  var credFileFullPath = path.join(homeDir(), credentialsLocation)
  try {
    var credFile = fs.readFileSync(credFileFullPath)
    publisherCredentials = JSON.parse(credFile).publisherCredentials
  } catch (er) {
    // skip error, as .microplan file may not be there
  }
  var exitingPublisherCreds = _.isArray(publisherCredentials) ? publisherCredentials : []
  return callback(null, credFileFullPath, exitingPublisherCreds, newPublisherCreds)
}

function writePublisherCredentials (credFileFullPath, exitingPublisherCreds, newPublisherCreds, callback) {
  fs.writeFile(
    credFileFullPath,
    JSON.stringify(
      {
        publisherCredentials: exitingPublisherCreds.concat(newPublisherCreds)
      }
    ),
    function (err) {
      if (err) {
        return callback(err)
      }
      console.log('The credentials was saved at ' + credFileFullPath)
      return callback()
    }
  )
}
