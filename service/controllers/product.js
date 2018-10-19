/**
 * 广告中心
 * @time 2015/4/22
 */

var _ = require('underscore');


//引入数据模型
var Product = require('../models/product');


//添加产品
exports.saveProduct = function (req, res) {
  var id = req.body._id
  var productObj = req.body
  var _product;

  if (id) {
    Product.findById(id, function(err, product){
      _product = _.extend(product, productObj)
      _product.save(function(err, product) {
        res.json({status:1})
      });
    })
  } else {
    _product = new Product(productObj);
    _product.save(function(err, product){
      console.log(11111111,product);
      res.json({status:1, data:product})
    })
  }
}
//获取广告
exports.getProductAll = function (req, res) {
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

  Product.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, product){
      if (err) {
        return res.json({status:0})
      }
      console.log(product)
      return Product.find(search).count(function(err, count) {
        if (err) {
          return res.json({status:0})
        }
        console.log(count)
        return res.json({'status':1, 'data': product, 'count': count,})
      })
    });
}
//删除产品
exports.delProduct = function (req, res) {
  var id = req.params.ids;
  var ids = id.split(',');
  if (ids && ids.length) {
    Product.remove({_id: {$in: ids}}, function(err, product){
      if (err) {
        res.json({status:0,message:err})
      } else {
        res.json({status:1})
      }
    })
  }
}
