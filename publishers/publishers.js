module.exports = (function () {
  return {
    github: {
      publish: require('./github/publish.js'),
      canLogin: true,
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
      canLogin: true,
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
      canLogin: false,  // disabling login until, we figure out the architecture
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
