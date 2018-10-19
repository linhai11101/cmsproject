var http = require('http');

var proxy = function(req, hostname, callback) {
  var options = {
    host: hostname,
    path: req.url,
    method: req.method
  }
  http.request(options, function(res){
    res.on('data', function (data) {
      try {
        data = JSON.parse(data);
      } catch (err) {
        callback(err)
      }
      callback(null,data)
    });
  }).end();
}
module.exports = proxy;
