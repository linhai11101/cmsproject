var express = require('express');
var router = express.Router();
var _ = require('underscore');

var config = require('../config');

// var Industrial = require('../models/industrial');
// var Market = require('../models/market');
var Cluster = require('../models/cluster');
var MarketProduct = require('../models/marketProduct');


router
  .get('/industrial', function(req, res) {

    var keyword = req.query.keyword ? req.query.keyword : null;
    var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
    var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
    var startRow = (current - 1)*perPage;
    var sortName = req.query.sortName || 'sortId';
    var sortOrder = req.query.sortOrder;
    if (sortOrder === 'false') {
      sortName = '-' + sortName
    }
    var search = {
      state: 1,
      clusterType:1
    };
    if (keyword) {
      search.name = new RegExp(keyword);
    }
    Cluster.find(search)
      .skip(startRow)
      .limit(perPage)
      .sort(sortName)
      .exec(function(err, list) {
        return Cluster.find(search).count(function(err, count){
          list = chgImg(list);
          return res.json({'status':1, data: list, count: count})
        })
      })

  })
  //此id为java那边存的id
  .get('/industrial/:id', function(req, res) {
    var keyword = req.query.keyword ? req.query.keyword : null;
    var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
    var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
    var startRow = (current - 1)*perPage;
    var sortName = req.query.sortName || 'sortId';
    var sortOrder = req.query.sortOrder;
    if (sortOrder === 'false') {
      sortName = '-' + sortName
    }

    var search = {
      'state': 1
    };

    var industrialId = req.params.id;
    search.pId = industrialId;

    if (keyword) {
      search.name = new RegExp(keyword);
    }
    IndustrialShop.find(search)
      .skip(startRow)
      .limit(perPage)
      .sort(sortName)
      .exec(function(err, shops) {
        if (err) {
          return res.json({'status':0, 'msg': err});
        }
        return IndustrialShop.find(search).count(function(err, count) {
          shops = chgImg(shops);
          res.json({'status':1, data: shops, count: count})
        })
      })
    //})
  })

  .get('/market', function(req, res) {

    var keyword = req.query.keyword ? req.query.keyword : null;
    var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
    var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
    var startRow = (current - 1)*perPage;
    var sortName = req.query.sortName || 'sortId';
    var sortOrder = req.query.sortOrder;
    if (sortOrder === 'false') {
      sortName = '-' + sortName
    }
    var search = {
      'ishidden': 1,
      'clusterType':2
    };
    if (keyword) {
      search.name = new RegExp(keyword);
    }
    Cluster.find(search)
      .skip(startRow)
      .limit(perPage)
      .sort(sortName)
      .exec(function(err, list) {
        return Cluster.find(search).count(function(err, count){
          list = chgImg(list);
          return res.json({'status':1, data: list, count: count})
        })
      })

  })
  //此id为java那边存的id
  .get('/market/:id', function(req, res) {
    var keyword = req.query.keyword ? req.query.keyword : null;
    var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
    var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
    var startRow = (current - 1)*perPage;
    var sortName = req.query.sortName || 'sortId';
    var sortOrder = req.query.sortOrder;
    if (sortOrder === 'false') {
      sortName = '-' + sortName
    }

    var search = {
      'marketId': req.params.id,
      'ishidden':1,
      'type': {$in: [3,4,5]}
    };

    if (keyword) {
      search.title = new RegExp(keyword);
    }
    MarketProduct.find(search)
      .skip(startRow)
      .limit(perPage)
      .sort(sortName)
      .exec(function(err, shops) {
        if (err) {
          return res.json({'status':0, 'msg': err});
        }
        return MarketProduct.find(search).count(function(err, count) {
          shops = chgImg(shops);
          res.json({'status':1, data: shops, count: count})
        })
      })
  })

function chgImg(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].img && /^\/group1.*/i.test(data[i].img)) {
      data[i].img = config.img_host + data[i].img
    }
    if (data[i].logo && /^\/group1.*/i.test(data[i].logo)) {
      data[i].logo = config.img_host + data[i].logo
    }
  }
  return data;
}

module.exports = router;
