/**
 * 广告中心
 * @time 2015/4/22
 */

var _ = require('underscore');


//引入数据模型
var Shops = require('../models/shops');


//添加产品
exports.saveShops = function (req, res) {
  var id = req.body._id
  var shopsObj = req.body
  var _shops;

  if (id) {
    Shops.findById(id, function(err, shops){
      _shops = _.extend(shops, shopsObj)
      _shops.save(function(err, shops) {
        res.json({status:1})
      });
    })
  } else {
    _shops = new Shops(shopsObj);
    _shops.save(function(err, shops){
      console.log(11111111,shops);
      res.json({status:1, data:shops})
    })
  }
}
//获取广告
exports.getShopsAll = function (req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1) * perPage;
  var sortName = req.query.shortName || 'sortid';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {
    sortName = '-' + sortName
  }

  //搜索
  var search = {}

  req.query.area && (search.area = req.query.area)

  Shops.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, shops){
      if (err) {
        return res.json({status:0})
      }
      console.log(shops)
      return Shops.find(search).count(function(err, count) {
        if (err) {
          return res.json({status:0})
        }
        console.log(count)
        return res.json({'status':1, 'data': shops, 'count': count,})
      })
    });
}
//删除产品
exports.delShops = function (req, res) {
  var id = req.params.ids;
  var ids = id.split(',');
  if (ids && ids.length) {
    Shops.remove({_id: {$in: ids}}, function(err, shops){
      if (err) {
        res.json({status:0,message:err})
      } else {
        res.json({status:1})
      }
    })
  }
}
