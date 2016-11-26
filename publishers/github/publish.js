var _ = require('underscore')
var createIssue = require('github-create-issue')

module.exports = function (publishItem, githubDone) {
  if (_.isEmpty(publishItem.config.username) || _.isEmpty(publishItem.config.repo) ||
                  _.isEmpty(publishItem.plan.title) || _.isEmpty(publishItem.token)) {
    githubDone(new Error('username, repo, title, token mandatory'))
    return
  }

  var username = publishItem.config.username
  var repo = publishItem.config.repo
  var title = publishItem.plan.title
  var optPayload = publishItem.plan
  optPayload.token = publishItem.token
  optPayload.body = publishItem.plan.description

  createIssue(username + '/' + repo, title, optPayload, function (err, res) {
    if (err) {
      githubDone(err)
    } else {
      githubDone(null, res)
    }
  })
}
