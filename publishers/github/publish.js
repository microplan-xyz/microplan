var _ = require('underscore')
var createIssue = require('github-create-issue')
var parseSlug = require('../../utils/utils.js').parseSlug

module.exports = function (publishItem, githubDone) {
  console.log('Sending HTTPS request to github')
  var projectSlug = publishItem.config.slug
  var title = publishItem.plan.title
  var optPayload = publishItem.plan
  var token = _.findWhere(publishItem.creds.loginOpts, {optName: 'token'}).answer
  if (_.isEmpty(token)) {
    return githubDone(new Error('Token mandatory'))
  }
  optPayload.token = token
  optPayload.body = publishItem.plan.description

  var parseSlugResult = parseSlug(publishItem.config.slug)
  if (_.isEmpty(parseSlugResult.namespace) || _.isEmpty(parseSlugResult.project) ||
                  _.isEmpty(publishItem.plan.title)) {
    githubDone(new Error('namespace, project, title mandatory'))
    return
  }
  createIssue(projectSlug, title, optPayload, function (err, res) {
    if (err) {
      githubDone(err)
    } else {
      githubDone()
    }
  })
}
