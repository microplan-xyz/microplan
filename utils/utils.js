var parseSlug = function (slug) {
  var result = {
    namespace: null,
    project: null
  }
  try {
    result.namespace = slug.split('/')[0]
    result.project = slug.split('/')[1]
  } catch (err) {
    return result
  }
  return result
}

module.exports =
{
  parseSlug: parseSlug
}
