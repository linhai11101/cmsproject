var logger = require('../util/logger')('acer');

module.exports = function(req, res, next) {
  var t = new Date();
  if (/.*\.(js|css|png|jpg)$/.test(req.url)) {
    return next();
  }

  if (/^\/cms\/api/.test(req.url) && req.session.user) {
    logger.info('\n\nStarted', '操作者:' + req.session.user.name, t.toISOString(), req.method, req.url, req.ip);
  } else {
    logger.info('\n\nStarted', t.toISOString(), req.method, req.url, req.ip);
  }

  res.on('finish', function() {
    var duration = ((new Date()) - t);
    logger.info('Completed', req.url, res.statusCode, '(' + duration + 'ms)')
  });
  next();
}
