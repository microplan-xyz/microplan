module.exports = (function () {
  return {
    github: {
      publish: require('./github/publish.js')
    },
    gitlab: {
      publish: require('./gitlab/publish.js')
    },
    gitter: {
      publish: require('./gitter/publish.js')
    }
  }
})()