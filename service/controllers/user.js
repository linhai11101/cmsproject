/**
 * 类目管理
 * @time 2016/4/20
 */

var mongoose = require('mongoose');
var _ = require('underscore');


//模型
var User = require('../models/user');


//获取一条类目
exports.login = function(req, res) {
  var _user = req.body
  var name = _user.name
  var password = _user.password

  User
    .findOne({name: name}, function(err, user) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      if (!user) {
        res.json({'status':0});
        return;
      }

      user.comparePassword(password, function(err, isMatch){
        if (err) {res.json({status: 0})}
        if (isMatch) {
          req.session.user = user;
          
          res.json({'status':1})
        } else {
          res.json({'status':0})
        }
      })
    })
}

exports.logout = function(req, res) {
  delete req.session.user;
  res.json({status:1})
}

//删除类目
//支持删除多个 用逗号分隔
exports.del = function(req, res) {

  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    User.remove({_id: {$in: idsArr}}, function (err, user) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}

//获取用户
exports.getList = function(req, res) {
 User
    .find({}, function(err, users) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      //if(user.password === password) {
      res.json({'status':1, data: users})
      //}
    })
}

//添加用户
exports.save = function(req, res) {
  var _user = req.body;

  User.findOne({name: _user.name}, function(err, user) {
    if (err) {res.json({'status':0})}

    if (user) {
      res.json({'status':0})
    }
    else {
      user = new User(_user);
      user.save(function(err, user) {
        if (err) {
          res.json({'status':0})
        }

        res.json({status:1, data:user})
      })
    }
  })
}


// 东
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.status(401).send('未登陆')
  }
  next()
}

exports.adminRequired = function(req, res, next) {
  var user = req.session.user;
  if (user.role < 10) {
    return res.json({status:-1, err: '无权限'})
  }
  next()
}
