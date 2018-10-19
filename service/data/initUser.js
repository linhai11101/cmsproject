var Superagent = require('superagent');
var mongoose = require('mongoose');

var User = require('../models/user');
var config = require('../config');
var dbUrl = config.URL;
var db = mongoose.connect(dbUrl);

var _user = {
  name: 'admin',
  password: 'guangmao5588!@',
  role: 15
}

User.findOne({name: _user.name}, function(err, user) {
  if (err) {res.json({'status':0})}

  if (user) {
    user.password=_user.password;
    user.save(function(err, user) {
      if (err) {
        console.log('fail');
      }

      console.log('success');
    })
    
  }
  else {
    user = new User(_user);
    user.save(function(err, user) {
      if (err) {
        console.log('添加失败');
      }

      console.log('添加成功');
    })
  }
})
