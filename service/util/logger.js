var log4js = require('log4js');
log4js.configure({
  appenders: [
    {type: 'console'},
    {
      type: 'dateFile',
      filename: 'logs/cheese',
      pattern: '-yyyy-MM-dd.log',
      maxLogSize: 1024,
      alwaysIncludePattern: true,
      //category: 'cheese',
      backups: 4 //日志备份数量，大于该数就自动删除
      //maxLogSize: 1024 * 1024
    }
  ]
  //,replaceConsole: true
});

module.exports = function(category){
  var logger = log4js.getLogger(category || 'cheese');
  logger.setLevel('INFO');
  return logger
}
