var createIssue = require('gitlab-create-issue')
var _ = require('underscore')
var parseSlug = require('../../utils/utils.js').parseSlug

module.exports = function (publishItem, gitLabDone) {
//  console.log('Sending HTTPS request to gitlab')
  var parseSlugResult = parseSlug(publishItem.config.slug)
  var token = _.findWhere(publishItem.creds.loginOpts, {optName: 'token'}).answer
  if (_.isEmpty(token)) {
    return gitLabDone(new Error('Token mandatory'))
  }
  if (_.isEmpty(parseSlugResult.namespace) || _.isEmpty(parseSlugResult.project) ||
                  _.isEmpty(publishItem.plan.title)) {
    return gitLabDone(new Error('namespace, project, title mandatory'))
  }

  var manPayload =
    {
      namespace: parseSlugResult.namespace,
      project: parseSlugResult.project,
      title: publishItem.plan.title,
      privateToken: token
    }
  var optPayload = publishItem.plan
  createIssue(manPayload, optPayload, function (err, res) {
    if (err) {
      gitLabDone(err)
    } else {
      gitLabDone(null, res)
    }
  })
}
