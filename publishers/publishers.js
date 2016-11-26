module.exports = (function () {
  return {
    github: {
      publish: require('./github/publish.js'),
      loginOpts: [
        {
          optName: 'username'
        },
        {
          optName: 'token'
        }
      ]
    },
    gitlab: {
      publish: require('./gitlab/publish.js'),
      loginOpts: [
        {
          optName: 'username'
        },
        {
          optName: 'token'
        }
      ]
    },
    gitter: {
      publish: require('./gitter/publish.js'),
      loginOpts: [
        {
          optName: 'room'
        },
        {
          optName: 'url'
        }
      ]
    }
  }
})()
