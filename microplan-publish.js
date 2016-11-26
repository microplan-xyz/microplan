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

program
  .parse(process.argv)

var args = program.args

if (!args.length) {
  console.error('Filename required')
  process.exit(1)
}

var credFileFullPath = path.join(homeDir(), credentialsLocation)
var publisherCredentials
try {
  var credFile = fs.readFileSync(credFileFullPath)
  publisherCredentials = JSON.parse(credFile).publisherCredentials
} catch (er) {
  console.error('Please use `microplan login` command to login and start publishing')
  process.exit(1)
}
var exitingPublisherCreds = _.isArray(publisherCredentials) ? publisherCredentials : []

var publishState = {
  succeededItems: [],
  failedItems: []
}

async.eachSeries(args,
  function (fileName, done) {
    if (_.isEmpty(fileName)) {
      console.error('FileName is empty')
    }

    var parsed = parsers.parseFile(
      path.join(process.cwd(), fileName)
    )
    var publishParams = _.reduce(
      parsed,
      function (p, c) {
        var result = {}
        if (_.isObject(c.configuration) && !_.isArray(c.configuration)) {
          result.configuration = _.extend(p.configuration, c.configuration)
        }

        if (_.isArray(c.plans)) {
          result.plans = p.plans.concat(c.plans)
        }

        if (_.isEmpty(result.configuration)) {
          result.configuration = {}
        }

        if (_.isEmpty(result.plans)) {
          result.plans = []
        }

        return result
      },
      {
        configuration: {},
        plans: []
      }
    )

    var errorInConfig = false
    _.each(publishParams.configuration,
      function (config) {
        if (_.isEmpty(config.type)) {
          console.error('Missing type for configuration: ', config)
          errorInConfig = true
        } else {
          config.publisher = publishers[config.type]
          if (_.isEmpty(config.publisher)) {
            console.error('Publisher not found for configuration: ', config)
            errorInConfig = true
          }
        }
      }
    )

    if (errorInConfig) {
      return done('Error in configuration.')
    }

    var publishItems = []
    _.each(publishParams.plans,
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
                config: publishParams.configuration[inConfigName]
              }
            }
          )
        )

        publishItems = _.map(publishItems,
          function (item) {
            var availableCreds = _.filter(exitingPublisherCreds,
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
      }
    )

    async.eachLimit(publishItems, 10,
      function (item, nextPublish) {
        var spinner = ora(
          util.format('%s :: %s', item.in, item.plan.title)
        ).start()

        var publish = item.config.publisher.publish
        publish(item, function (err, result) {
          delete item.creds
          if (err) {
            // console.error('Error while publishing ', '"' + item.plan.title + '"', 'in', item.in)
            publishState.failedItems.push({
              error: err,
              publishItem: item
            })
            spinner.fail()
            return nextPublish()
          }

          // console.log('Published ', '"' + item.plan.title + '"', 'in', item.in)
          publishState.succeededItems.push({
            result: result,
            publishItem: item
          })
          spinner.succeed()
          return nextPublish()
        })
      },
      function () {
        try {
          var stateFilePath = path.join(process.cwd(), fileName + '.state.json')
          fs.writeFileSync(stateFilePath, JSON.stringify(publishState))
          return done()
        } catch (err) {
          return done(err)
        }
      }
    )
  },
  function (err) {
    if (err) {
      // console.error('Error while publishing plan')
      console.error(err)
    } else {
      // console.log('Plans published')
    }
  }
)
