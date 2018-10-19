/**
 * 广告中心
 * @time 2015/4/22
 */

var _ = require('underscore');


//引入数据模型
var Ads = require('../models/ads');


//添加产品
exports.saveAds = function (req, res) {
  var id = req.body._id
  var adsObj = req.body
  var _ads;

  if (id) {
    Ads.findById(id, function(err, ads){
      _ads = _.extend(ads, adsObj)
      _ads.save(function(err, ads) {
        res.json({status:1})
      });
    })
  } else {
    _ads = new Ads(adsObj);
    _ads.save(function(err, ads){
      
      res.json({status:1, data:ads, data1: 'dd'})
    })
  }
}
//获取广告
exports.getAdsAll = function (req, res) {
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

  Ads.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, ads){
      if (err) {
        return res.json({status:0})
      }
      console.log(ads)
      return Ads.find(search).count(function(err, count) {
        if (err) {
          return res.json({status:0})
        }
        console.log(count)
        return res.json({'status':1, 'data': ads, 'count': count})
      })
    });
}
//删除产品
exports.delAds = function (req, res) {
  var id = req.params.ids;
  var ids = id.split(',');
  if (ids && ids.length) {
    Ads.remove({_id: {$in: ids}}, function(err, ads){
      if (err) {
        res.json({status:0,message:err})
      } else {
        res.json({status:1})
      }
    })
  }
}

//删除产品
exports.getAppIndexAds = function (req, res) {

   Ads.find({'ishidden':1, 'area':12})
    .sort('sortid')
    .limit(1)
    .exec(function(err, ads) {
      console.log(ads);
      if (err) {
        return res.json({'status':0, 'msg': err});
      }

      res.json({"status":1,"data":ads})
      
    })
}
