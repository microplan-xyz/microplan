var https = require('https')
var url = require('url')
var querystring = require('querystring')

module.exports = function (publishItem, gitterDone) {
//  console.log('Sending HTTPS request to gitter')

  var gitter = url.parse(publishItem.config.url)

  var postData = querystring.stringify({
    message: publishItem.plan.title + ' -- ' + publishItem.plan.description
  })

  var options = {
    protocol: gitter.protocol,
    hostname: gitter.host,
    port: 443,
    path: gitter.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  var req = https.request(options, (res) => {
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
  //    console.log(chunk.toString())
    })
    res.on('end', function () {
      gitterDone()
    })
  })

  req.on('error', function (e) {
    // console.error(e)
    gitterDone(e)
  })

  // write data to request body
  req.write(postData)
  req.end()
}
