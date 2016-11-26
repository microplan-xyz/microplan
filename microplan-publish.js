var program = require('commander')
var async = require('async')
var path = require('path')
var parsers = require('./parsers/parsers.js')
var publishers = require('./publishers/publishers.js')
var _ = require('underscore')

program
  .parse(process.argv)

var args = program.args

if (!args.length) {
  console.error('Filename required')
  process.exit(1)
}

async.eachSeries(args,
  function (fileName, done) {
    if (_.isEmpty(fileName)) {
      console.error('FileName is empty')
    }

    var parsed = parsers.parseFile(
      path.join(__dirname, fileName)
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

        if (_.isEmpty(result.configuration))
          result.configuration = {}

        if (_.isEmpty(result.plans))
          result.plans = []

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
      }
    )

    async.eachLimit(publishItems, 10,
      function (item, nextPublish) {
        console.log('Publishing ', '"' + item.plan.title + '"', 'in', item.in)
        var publish = item.config.publisher.publish

        publish(item, function (err) {
          if (err) {
            console.error('Error while publishing ', '"' + item.plan.title + '"', 'in', item.in)
            return nextPublish({
              error: err,
              publishItem: item
            })
          }

          console.log('Published ', '"' + item.plan.title + '"', 'in', item.in)
          return nextPublish()
        })
      },
      function (err) {
        return done(err)
      }
    )
  },
  function (err) {
    if (err) {
      console.error('Error while publishing plan')
      console.error(err)
    } else {
      console.log('Plans published')
    }
  }
)
