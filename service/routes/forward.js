var http = require('http');
var express = require('express');

var proxy = require('../util/proxy');

var Router = express.Router();


// Router.get('/specialTown/searchTown.cf', function(req, res) {
//   proxy(req, 'dev.gdpcrm.com', function(err, data) {
//     if (err) {
//       return res.send({code:-8888, meg: err})
//     }
//     return res.send(data)
//   })
// })

// 获取请求的headers，去掉host和connection
var getHeader = function (req) {
  var ret = {};
  for (var i in req.headers) {
    if (!/host|connection/i.test(i)) {
      ret[i] = req.headers[i];
    }
  }
  ret.cookie +=';JSESSIONID=13FB3BEF001A8BFCB91492C3860B1F36';
  return ret;
};

// Router.post('/cms/userLogin.cf', function(req, res) {
//     var opt = {
//       hostname: 'dev.gdp.com',
//       path: '/cms/userLogin.cf',
//       method: 'post',
//       headers: getHeader(req)
//     }
//     var req2 = http.request(opt, function(res2) {
//       //res.writeHead(res2.statusCode, res2.headers);
//       //res2.pipe(res)

//       res2.on('data', function (data) {
//         console.log('>>> ', data);
//         data = JSON.parse(data);
//         res.send(data);
//       });

//     })
//     req2.end();

//   })


module.exports = Router;
