var mongoose = require('mongoose');
var config = require('../config');
//链接数据库
var dbUrl = config.URL;
var db = mongoose.connect(dbUrl)

require('./initUser')
require('./crawler-index')
require('./crawler-market')
require('./crawler-industrial')
require('./crawler-sample')

require('./getCategory')

