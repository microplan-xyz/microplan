var program = require('commander')
var async = require('async')
var path = require('path')
var parsers = require('./parsers/parsers.js')
var publishers = require('./publishers/publishers.js')
var _ = require('underscore')
var homeDir = require('home-dir')
var credentialsLocation = '.microplan'
var fs = require('fs')
var ora = require('ora')
var util = require('util')

async.waterfall(
  [
    parseProgramArgs,
    checkForCredentials,
    parseFileToBePublished,
    validateConfiguration,
    validatePlans,
    generatePublishItems,
    injectCredentials,
    determinePublishMethod,
    publishPlans,
    writeStateFile
  ],
  function (err, result) {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    process.exit(0)
  }
)

function parseProgramArgs (callback) {
  program
    .option('-s, --serial', 'Publish plans serially')
    .option('-p, --parallel', 'Publish plans parallely')
    .parse(process.argv)

  var args = program.args

  if (!args.length) {
    return callback(new Error('Filename required'))
  }

  var fileNameToBePublished = args[0]

  return callback(null, fileNameToBePublished)
}

function checkForCredentials (fileNameToBePublished, callback) {
  var credFileFullPath = path.join(homeDir(), credentialsLocation)
  var publisherCredentials
  try {
    var credFile = fs.readFileSync(credFileFullPath)
    publisherCredentials = JSON.parse(credFile).publisherCredentials
  } catch (er) {
    return callback(new Error(
      'Please use `microplan login` command to login and start publishing'))
  }
  publisherCredentials =
    _.isArray(publisherCredentials) ? publisherCredentials : []

  return callback(null, publisherCredentials, fileNameToBePublished)
}

function parseFileToBePublished (publisherCredentials, fileNameToBePublished,
  callback) {
  if (_.isEmpty(fileNameToBePublished)) {
    return callback(new Error('FileName is empty'))
  }

  var parsedPublishFileOutputs = parsers.parseFile(
    path.join(process.cwd(), fileNameToBePublished)
  )

  var parsedPublishFile = _.first(parsedPublishFileOutputs)

  if (_.isEmpty(parsedPublishFile)) {
    return callback(new Error('Unable to parse input file.'))
  }

  return callback(null, publisherCredentials, fileNameToBePublished,
    parsedPublishFile)
}

function validateConfiguration (publisherCredentials, fileNameToBePublished,
  parsedPublishFile, callback) {
  if (!_.isObject(parsedPublishFile.configuration) ||
    _.isArray(parsedPublishFile.configuration)) {
    return callback(new Error('Configuration should be an object with ' +
      'unique configuration identifiers'))
  }

  var errorsInConfig = []
  _.each(parsedPublishFile.configuration,
    function (config) {
      // check type
      if (_.isEmpty(config.type)) {
        errorsInConfig.push('Missing type for configuration:' +
          config)
        return
      }

      // check if valid publisher exists for given yml type
      config.publisher = publishers[config.type]
      if (_.isEmpty(config.publisher)) {
        errorsInConfig.push('Publisher not found for configuration:' +
          config)
      }
    }
  )

  if (!_.isEmpty(errorsInConfig)) {
    return callback(new Error('Invalid configuration ' +
      errorsInConfig.join()))
  }

  return callback(null, publisherCredentials, fileNameToBePublished,
    parsedPublishFile)
}

function validatePlans (publisherCredentials, fileNameToBePublished,
  parsedPublishFile, callback) {
  if (!_.isArray(parsedPublishFile.plans)) {
    return callback(new Error('plans should be an array with ' +
      'title, description and in elements'))
  }

  // Do more validation if needed.

  return callback(null, publisherCredentials, fileNameToBePublished,
    parsedPublishFile)
}

function generatePublishItems (publisherCredentials, fileNameToBePublished,
  parsedPublishFile, callback) {
  // publishItems are building blocks of a publish operation
  // goal of it to produce individual, self contained object, which contains
  // all the information (payload, credentials etc.) needed for publishing an item
  var publishItems = []

  _.each(parsedPublishFile.plans,
    function (plan) {
      var inArr = []
      if (_.isString(plan.in)) {
        inArr = [plan.in]
      } else if (_.isArray(plan.in)) {
        inArr = plan.in
      }

      publishItems = publishItems.concat(
        _.map(inArr,
          function (inConfigName) {
            return {
              in: inConfigName,
              plan: plan,
              config: parsedPublishFile.configuration[inConfigName]
            }
          }
        )
      )
    }
  )

  return callback(null, publisherCredentials, fileNameToBePublished,
    parsedPublishFile, publishItems)
}

function injectCredentials (publisherCredentials, fileNameToBePublished,
  parsedPublishFile, publishItems, callback) {
  publishItems = _.map(publishItems,
    function (item) {
      var availableCreds = _.filter(publisherCredentials,
        function (cred) {
          return cred.type === item.config.type
        }
      )

      // considering first object to be found with same type as
      // default credentials for a publisher to publisher
      item.creds = _.first(availableCreds)
      return item
    }
  )

  return callback(null, fileNameToBePublished, publishItems)
}

function determinePublishMethod (fileNameToBePublished, publishItems,
  callback) {
  // default publish method is serial
  var publishMethod = async.eachSeries.bind(null, publishItems)

  if (program.parallel === true) {
    publishMethod = async.eachLimit.bind(null, publishItems, 10)
  }

  return callback(null, fileNameToBePublished, publishItems, publishMethod)
}

function publishPlans (fileNameToBePublished, publishItems, publishMethod,
  callback) {
  var publishState = {
    succeededItems: [],
    failedItems: []
  }

  publishMethod(
    function (item, nextPublish) {
      var spinner = ora(
        util.format('%s :: %s', item.in, item.plan.title)
      ).start()

      var publish = item.config.publisher.publish

      publish(item, function (err, result) {
        // credentials should not be stored in the state file
        delete item.creds

        if (err) {
          publishState.failedItems.push({
            error: err,
            publishItem: item
          })
          spinner.fail()
          return nextPublish()
        }

        publishState.succeededItems.push({
          result: result,
          publishItem: item
        })
        spinner.succeed()
        return nextPublish()
      })
    },
    function () {
      return callback(null, fileNameToBePublished, publishState)
    }
  )
}

function writeStateFile (fileNameToBePublished, publishState, callback) {
  try {
    var stateFilePath = path.join(process.cwd(),
      fileNameToBePublished + '.state.json')
    fs.writeFileSync(stateFilePath, JSON.stringify(publishState))
    return callback(null)
  } catch (err) {
    return callback(new Error('Unable to save state file for ' +
      fileNameToBePublished + ' - ' + err))
  }
}
