var Superagent = require('superagent');
var mongoose = require('mongoose');

var User = require('../models/user');
var config = require('../config');

//链接数据库
var dbUrl = config.URL;
var db = mongoose.connect(dbUrl);

var _user = {
  name: 'admin',
  password: '123456',
  role: 15
}

User.findOne({name: _user.name}, function(err, user) {
  if (err) {res.json({'status':0})}

  if (user) {
    console.log('已存在');
  }
  else {
    user = new User(_user);
    user.save(function(err, user) {
      if (err) {
        console.error('添加失败');
      }

      console.log('添加成功');
    })
  }
})
