var createIssue = require('gitlab-create-issue')
var _ = require('underscore')

module.exports = function (publishItem, gitLabDone) {
  if (_.isEmpty(publishItem.config.namespace) || _.isEmpty(publishItem.config.project) ||
                  _.isEmpty(publishItem.plan.title) || _.isEmpty(publishItem.token)) {
    gitLabDone(new Error('namespace, project, title, token mandatory'))
    return
  }

  var manPayload =
    {
      namespace: publishItem.config.namespace,
      project: publishItem.config.project,
      title: publishItem.plan.title,
      privateToken: publishItem.token
    }
  var optPayload = publishItem.plan

  createIssue(manPayload, optPayload, function (err, res) {
    if (err) {
      gitLabDone(err)
    } else {
      gitLabDone()
    }
  })
}
