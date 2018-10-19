/**
 * 类目管理
 * @time 2016/4/20
 */

var mongoose = require('mongoose');
var _ = require('underscore');
var eventproxy = require('eventproxy');


//模型
var Category = require('../models/category');

var redis = require('../util/redis')
var toTreeData = require('../util/tree').toTreeData

//获取类目
exports.getAll = function(req, res) {
  var a = +new Date();
  Category
    .find({})
    .sort('sortId')
    .exec(function(err, category) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: category});
    })
}

//设置缓存
exports.setCache = function(req, res) {
  Category
    .find({ishidden: 1})
    .sort('sortId')
    .exec(function(err, category) {
      category = JSON.parse(JSON.stringify(category));
      var a = toTreeData(category, 0)
      a = JSON.stringify(a)
      redis.set('category', a, function(err){
        res.json({status: 1})
      });
    })
}


//获取类目
exports.get = function(req, res) {
  var parentid = req.params.parentid;
  Category
    .find({'parent': parentid})
    .sort('sortId')
    .exec(function(err, category) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: category})
    })
}
//获取一条类目
exports.getOne = function(req, res) {
  var id = req.params.id;
  Category
    .findById(id, function(err, category) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: category})
    })
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
    Category.remove({_id: {$in: idsArr}}, function (err, category) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}

//添加类目
exports.save = function(req, res) {
  var id = req.body._id;
  var categoryObj = req.body;
  var _cate;
  if (id) {
    Category.findById(id, function(err, category) {
      _cate = _.extend(category, categoryObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new Category(categoryObj);
    _cate.save(function(err, category){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();

      res.json({status:1, data:category})
    })
  }
}

//移动类目
exports.move = function(req, res) {
  var targetId = req.body.targetId;
  var originIds = req.body.originIds.split(',');

  if (!targetId || !(originIds && originIds.length)) {
    return res.json({status:0, msg: '数据不正确'});
  }

  var ep = new eventproxy();

  ep.after('move', originIds.length, function(topics) {
    res.json({status:'1'})
  });

  originIds.forEach(function(id, i) {
    Category.findById(id, function(err, resCate) {
      _cate = _.extend(resCate, {parentid: targetId});
      _cate.save(function(err, cate) {
        ep.emit('move');
      })
    })
  });
}
