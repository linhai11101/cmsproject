var redis = require('ioredis');
var config = require('../config');
var logger = require('../util/logger')('init');

//链接缓存
var client = new redis({
  port: config.redis_port,
  host: config.redis_host,
  db: config.redis_db
});

client.on('error', function(err){
  logger.log('redis链接失败: ' + err);
});

module.exports = client;
