/**
 * 样品中心
 * @time 2015/4/22
 */

var _ = require('underscore');


//引入数据模型
var Sample = require('../models/sample');
var SampleProduct = require('../models/sampleProduct');


//获取楼层
exports.getSort = function(req, res) {
  Sample
    .find({})
    .sort('sortId')
    .exec(function(err, sample){
      if (err) {
        console.log(err);
      }
      res.json({'status':1, 'data': sample})
    });
}
//添加楼层
exports.saveSort = function (req, res) {
  var id = req.body._id
  var sampleObj = req.body
  var _sample;

  if (id) {
    Sample.findById(id, function(err, sample){
      _sample = _.extend(sample, sampleObj)
      _sample.save(function(err, sample) {
        res.json({status:1})
      });
    })
  } else {
    _sample = new Sample(sampleObj);
    _sample.save(function(err, sample){
      res.json({status:1, data: {_id: sample._id}})
    })
  }
}
//删除楼层
exports.delSort = function (req, res) {
  var id = req.params.id;
  if (id) {
    Sample.remove({_id: id}, function(err, sample){
      if (err) {
        res.json({status:0,message:err})
      } else {
        res.json({status:1})
      }
    })
  }
}


//添加产品
exports.saveProduct = function (req, res) {
  var id = req.body._id
  var productObj = req.body
  var _product;

  if (id) {
    SampleProduct.findById(id, function(err, product){
      _product = _.extend(product, productObj)
      _product.save(function(err, product) {
        res.json({status:1})
      });
    })
  } else {
    _product = new SampleProduct(productObj);
    _product.save(function(err, product){
      res.json({status:1, data: {_id: product._id}})
    })
  }
}
//获取产品
exports.getProduct = function (req, res) {
  var id = req.params.id;
  SampleProduct
    .find({'pid': id})
    .sort('sortId')
    .exec(function(err, sample){
      if (err) {
        console.log(err);
      }
      res.json({'status':1, 'data': sample})
    });
}
//删除产品
exports.delProduct = function (req, res) {
  var id = req.params.id;
  if (id) {
    SampleProduct.remove({_id: id}, function(err, product){
      if (err) {
        res.json({status:0,message:err})
      } else {
        res.json({status:1})
      }
    })
  }
}
//点赞
exports.productLike = function (req, res) {
  var id = req.params.id

  if (id) {
    SampleProduct.findById(id, function(err, product){
      product.link = ~~product.link + 1;
      product.save(function(err) {
        res.json({status:1})
      });
    })
  }
}
