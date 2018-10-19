/**
 * 广贸基地
 * @time 2016/4/21
 */

var mongoose = require('mongoose');
var _ = require('underscore');
var Superagent = require('superagent');

//模型
// var Market = require('../models/market');
var Cluster = require('../models/cluster');
var MarketBanner = require('../models/marketBanner');
var MarketRecommendation = require('../models/marketRecommendation');
var MarketRecommendProduct = require('../models/marketRecommendProduct');
var MarketHot = require('../models/marketHot');
var MarketHotProduct = require('../models/marketHotProduct');
var MarketBest = require('../models/marketBest');
var MarketBestProduct = require('../models/marketBestProduct');
var MarketIndexActive = require('../models/marketIndexActive');
var MarketFeedback = require('../models/marketFeedback');
var MarketActiveBanner = require('../models/marketActiveBanner');
var MarketActive = require('../models/marketActive');
var MarketAllActivity = require('../models/marketallactivitys');
var MarketCate = require('../models/marketCate');

var MODEL_ARRAY = [MarketBanner,MarketRecommendation,MarketRecommendProduct,MarketHot,MarketHotProduct,MarketBest,MarketBestProduct,MarketIndexActive,MarketFeedback,MarketActiveBanner,MarketActive,MarketAllActivity,MarketCate];

var domainCrm = require('../config').java_api_host;

// 专业市场数据切割
exports.dataCutter = function(req,res){
  MODEL_ARRAY.forEach(function(item,index){
    item.find()
      .exec(function(err,cutRes){
        if (err) {return res.json({code:1,msg:err});}
        var _cutRes = cutRes.length==0?[]:JSON.parse(JSON.stringify(cutRes));
        console.log(_cutRes);
        _cutRes.forEach(function(a,idx){
          console.log(a);
          if (a.marketId && a.marketId != 0) {
            var _id = a._id;
            delete a._id;
            a.iwId = a.marketId;
            a.marketId = 0;
            item.update({_id:_id},a,function(err){
              if (err) {return res.json({code:1,data:err,msg:'更新' + _id + '数据失败'})}
            });
          }
          if (index==MODEL_ARRAY.length-1) {
            return res.json({code:0,msg:'切割数据完成'});
          }
        })
      })
  })
}

//获取专业市场
function getRemoteZysc(callBack) {
  console.log(domainCrm)
  if (!callBack) {
    callBack = function(){};
  }

  var url = domainCrm + "/cms/wcenter/home/wcenterInfo.cf";
  Superagent.post(url)
    .end(function(err, res) {
      console.log(res);
      console.log(url);
      if (err) return callBack(err);
         // 清空原来的数据
      Cluster.remove({clusterType:2},function(err,removeres){
        if (err) {
          return callBack(err);
        };
        console.log(removeres);
      });
       var count = 0, updateCount = 0;
         if(res.body.data.length!=0){
            
          res.body.data.forEach(function(item, i) {
           Cluster.find({clusterType:2})
            .exec(function(err, resZysc) {
              console.log(resZysc)
              console.log(resZysc.length)
            if (err) return callBack(err);
              if (!resZysc.length){
                var zyscObj = {
                  activitiesNumber:item.activitiesNumber,
                  avatarImage:item.avatarImage,
                  cityId:item.cityId,
                  cityName:item.cityName,
                  clickTraffic:item.clickTraffic,
                  collections:item.collection,
                  countryName:item.countryName,
                  feedbackNumber:item.feedbackNumber,
                  government:item.government,
                  industryId:item.industryId,
                  industryName:item.industryName,
                  iwDetail:item.iwDetail,
                  iwId:item.iwId,
                  joinTime:item.joinTime,
                  logo:item.logo,
                  mainProduct:item.mainProduct,
                  nameEn:item.nameEn,
                  numberNo:item.numberNo,
                  productNumber:item.productNumber,
                  propagandaPicture:item.propagandaPicture,
                  provinceId:item.provinceId,
                  provinceName:item.provinceName,
                  searchImage:item.searchImage,
                  sgsHas:item.sgsHas,
                  sld:item.sld,
                  sumScore:item.sumScore,
                  suppliersNumber:item.suppliersNumber,
                  volume:item.volume,
                  wcenterNumber:item.wcenterNumber,
                  clusterType:2,//clusterType:为2时是批发市场
                  isCollect:false,
                    relateIds:item.relateIds
                };
                var _zysc = new Cluster(zyscObj);
                _zysc.save(function(err, reszysc1){
                  if (err) return callBack(err);
                  console.log(reszysc1);
                })
                updateCount++
              }
            count++;
            _cb();
          })
           })
         }else{
          _cb();
         }

       
       function _cb() {
        if (count ==  res.body.data.length) {
          callBack(null, count, updateCount)
        }
      }

    })
}


//添加产品
exports.saveMarket = function (req, res) {
  var id = req.body._id;
  var marketObj = req.body;
  var _market;

  if (id) {
    Cluster.findById(id, function(err, market){
      _product = _.extend(market, marketObj)
      _product.save(function(err, market) {
        res.json({status:1})
      });
    })
  } else {
    _market = new Cluster(marketObj);
    _market.save(function(err, market){
      res.json({status:1, data: {_id: market._id}})
    })
  }
}


// // 同步专业市场列表

exports.syncZysc= function(req, res) {
  getRemoteZysc(function(err, count, updateCount){
    if (err) {
      return res.json({status: 0,msg:err})
    }
    res.json({"status":1, "count": count, "updateCount": updateCount})
  })
}
//获取某个专业市场下的批发中心列表
exports.get = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var industryId = req.query.industryId;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var search = {industryId:industryId,clusterType:2};

  Cluster.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, market) {
      if (err) return res.json({'status':0, 'msg': err});
      Cluster.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })
}

exports.getOne = function(req, res) {
  var id = req.params.id;

  Cluster.find({iwId:id}, function(err, market) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: market})
    })
}
exports.get1 = function(req, res) {
  var iwId =req.query.iwId;

  Cluster.find({iwId:iwId}, function(err, market) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: market})
    })
}
exports.del = function(req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    Cluster.remove({_id: {$in: idsArr}}, function (err, market) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}

//保存专业市场类目菜单&&删除专业市场类目二级菜单
exports.saveCate = function(req,res){
  var _cateMenuObj = req.body.data;
  var cateMenuObj = JSON.parse(_cateMenuObj);
  var id = cateMenuObj._id;
  var _cateMenu;
  console.log(cateMenuObj);
  if (id) {
    MarketCate.findById(id,function(err,cateMenu){
      _cateMenu = _.extend(cateMenu,cateMenuObj);
      console.log(_cateMenu);
      _cateMenu.save(function(err,menu){
        res.json({status:1});
      })
    })
  }else{
    _cateMenu = new MarketCate(cateMenuObj);
    _cateMenu.save(function(err,menu){
      res.json({status:1,data:menu});
    })
  }
} 
// 获取专业市场分类菜单
exports.getCate = function(req,res){
  var sortId = 'sortId';
  var iwId = req.query.iwId;
  var search = {
    iwId: iwId
  };
  MarketCate.find(search)
    .sort(sortId)
    .exec(function(err,cateMenus){
      if (err) {
        return res.json({'status':0,'msg':err});
      };
      return MarketCate.find(search).count(function(err,count){
        res.json({'status':1, 'data':cateMenus,'count':count});
      }) 
    })
}
// 删除专业镇分类菜单
exports.delCate = function(req,res){
  var ids = req.params.ids;
  console.log(req);
  if (ids) {
    MarketCate.remove({_id:ids},function(err,cateMenuRes){
      if (err) {
        res.json({'status':0,'msg':err});
        return;
      };
      res.json({'status':1,'data':cateMenuRes});
    })
  }

}

// 专业市场首页的banner

exports.getBanner = function(req, res) {
   var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;

  var search = {};
  req.query.iwId && (search.iwId = req.query.iwId)

  MarketBanner.find(search)
    .skip(startRow)
    .limit(perPage)
    .exec(function(err, market) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketBanner.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })
}
exports.addBanner = function(req, res) {
  var id = req.body._id;
  console.log(id)
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketBanner.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketBanner(marketObj);
    _cate.save(function(err, market){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:market})
    })
  }
}


exports.getOneBanner = function(req, res) {
  var id = req.query._id;
 MarketBanner.find({_id:id}, function(err, market) {
    console.log(market[0])
     res.json({data:market[0]})
     })
}


exports.delOneBanner = function(req, res) {
  var id = req.body._id;
  console.log(id);
 MarketBanner.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}

// 专业市场首页的recommendation

exports.getRecommendation = function(req, res) {

     var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {sortName = '-' + sortName};
  var search = {};
  req.query.iwId && (search.iwId = req.query.iwId);

  MarketRecommendation.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, market) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketRecommendation.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })

 
}

exports.saveRecommendation = function(req, res) {
 var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketRecommendation.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketRecommendation(marketObj);
    _cate.save(function(err, market){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:market})
    })
  }
}

  exports.getOneRecommendation = function(req, res) {
  var id = req.query._id;
 MarketRecommendation.find({_id:id}, function(err, market) {
     res.json({data:market[0]})
     })
}


exports.delOneRecommendation = function(req, res) {
  var id = req.body._id;
 MarketRecommendation.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}


// 专业市场首页的recommendation管理产品

exports.getRecommendProduct = function(req, res) {
    
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {sortName = '-' + sortName};

  var search = {};
  req.query.iwId && (search.iwId = req.query.iwId);
   req.query.shopId && (search.shopId = req.query.shopId);

  MarketRecommendProduct.find(search)
    .sort(sortName)
    .exec(function(err, market) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketRecommendProduct.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })

}

exports.saveRecommendProduct = function(req, res) {
 var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketRecommendProduct.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketRecommendProduct(marketObj);
    _cate.save(function(err, market){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:market})
    })
  }
}

  exports.getOneRecommendProduct = function(req, res) {
  var id = req.query._id;
  console.log(id);
 MarketRecommendProduct.find({_id:id}, function(err, market) {
     res.json({data:market[0]})
     })
}


exports.delRecommendProduct= function(req, res) {
  var id = req.body._id;
 MarketRecommendProduct.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}

// 专业市场首页的hotproduct

exports.getHot = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {sortName = '-' + sortName};

  var search = {};
  req.query.iwId && (search.iwId = req.query.iwId);

  MarketHot.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, market) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketHot.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })
}

exports.saveHot = function(req, res) {
 var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketHot.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketHot(marketObj);
    _cate.save(function(err, market){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:market})
    })
  }
}

exports.editHot = function(req, res) {

  var id = req.query._id;
 MarketHot.find({_id:id}, function(err, market) {
     res.json({data:market[0]})
     })
}


exports.delHot = function(req, res) {
  var id = req.body._id;
 MarketHot.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}

// 专业市场首页的hotproduct 产品管理

exports.getHotProduct = function(req, res) {
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {sortName = '-' + sortName};
  var search = {};
  req.query.iwId && (search.iwId = req.query.iwId);
  req.query.shopId && (search.shopId = req.query.shopId);

  MarketHotProduct.find(search)
    .sort(sortName)
    .exec(function(err, market) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketHotProduct.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })
 
}

exports.saveHotProduct  = function(req, res) {
 var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketHotProduct.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketHotProduct(marketObj);
    _cate.save(function(err, market){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:market})
    })
  }
}

exports.editHotProduct = function(req, res) {
  var id = req.query._id;
 MarketHotProduct.find({_id:id}, function(err, market) {
    console.log(market[0])
     res.json({data:market[0]})
     })
}


exports.delHotProduct = function(req, res) {
  var id = req.body._id;
 MarketHotProduct.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}


// 专业市场首页的bestseller

exports.getBestSeller = function(req, res) {

     var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {sortName = '-' + sortName};

  var search = {};
  req.query.iwId && (search.iwId = req.query.iwId);

  MarketBest.find(search)
    .skip(startRow)
    .limit(perPage)
    .populate('floorId')
    .sort(sortName)
    .exec(function(err, market) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketBest.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })
 
}

exports.saveBestSeller = function(req, res) {
 var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketBest.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketBest(marketObj);
    _cate.save(function(err, market){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:market})
    })
  }
}

  exports.getOneBestSeller = function(req, res) {
  var id = req.query._id;
 MarketBest.find({_id:id}, function(err, market) {
     res.json({data:market[0]})
     })
}


exports.delBestSeller = function(req, res) {
  var id = req.body._id;
 MarketBest.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}




// 专业市场首页的bestseller管理产品

exports.getBestProduct = function(req, res) {
    
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {sortName = '-' + sortName};

  var search = {};
  req.query.iwId && (search.iwId = req.query.iwId);
  req.query.shopId && (search.shopId = req.query.shopId);

  MarketBestProduct.find(search)
    .sort(sortName)
    .exec(function(err, market) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketBestProduct.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })

}

exports.saveBestProduct = function(req, res) {
 var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketBestProduct.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketBestProduct(marketObj);
    _cate.save(function(err, market){
      res.json({status:1, data:market})
    })
  }
}

exports.getOneBestProduct = function(req, res) {
  var id = req.query._id;
 MarketBestProduct.find({_id:id}, function(err, market) {
     res.json({data:market[0]})
     })
}

exports.delBestProduct= function(req, res) {
  var id = req.body._id;
 MarketBestProduct.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}


// 专业市场首页的活动
exports.getIndexActive = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {sortName = '-' + sortName};

  var search = {};
  req.query.iwId && (search.iwId = req.query.iwId);

  MarketIndexActive.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, market) {
      console.log(market);
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketIndexActive.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })
}
exports.addIndexActive = function(req, res) {

  var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    console.log("addIndexActive");
    MarketIndexActive.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
     console.log("addIndexActive");
    _cate = new MarketIndexActive(marketObj);
    _cate.save(function(err, market){
      res.json({status:1, data:market})
    })
  }
}

exports.editIndexActive = function(req, res) {
  var id = req.query._id;
 MarketIndexActive.find({_id:id}, function(err, market) {
     res.json({data:market[0]})
     })
}


exports.delIndexActive = function(req, res) {
  var id = req.body._id;
 MarketIndexActive.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}

// 专业市场首页的反馈
exports.getFeedback = function(req, res) {
   var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {sortName = '-' + sortName};

  var search = {};
  req.query.iwId && (search.iwId = req.query.iwId);
  MarketFeedback.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, market) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketFeedback.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })
}
exports.addFeedback = function(req, res) {
  var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketFeedback.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketFeedback(marketObj);
    _cate.save(function(err, market){
      res.json({status:1, data:market})
    })
  }
}

exports.editFeedback = function(req, res) {
  var id = req.query._id;
 MarketFeedback.find({_id:id}, function(err, market) {
     res.json({data:market[0]})
     })
}


exports.delFeedback = function(req, res) {
  var id = req.body._id;
 MarketFeedback.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}

// 活动页面banner
// 专业市场首页的banner

exports.getActiveBanner = function(req, res) {
   var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;

  var search = {};
  req.query.iwId && (search.iwId = req.query.iwId);

  MarketActiveBanner.find(search)
    .skip(startRow)
    .limit(perPage)
    .exec(function(err, market) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketActiveBanner.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })
}
exports.addActiveBanner = function(req, res) {
  var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketActiveBanner.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketActiveBanner(marketObj);
    _cate.save(function(err, market){
      res.json({status:1, data:market})
    })
  }
}

exports.editActiveBanner = function(req, res) {
  var id = req.query._id;
 MarketActiveBanner.find({_id:id}, function(err, market) {
     res.json({data:market[0]})
     })
}


exports.delActiveBanner = function(req, res) {
  var id = req.body._id;
 MarketActiveBanner.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}

// 活动页面的活动

exports.getActive = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {sortName = '-' + sortName};

  var search = {};
  req.query.marketId && (search.marketId = req.query.marketId);
  
  MarketActive.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, market) {
      console.log(market)
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return MarketActive.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })
}
exports.addActive = function(req, res) {
  var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketActive.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketActive(marketObj);
    _cate.save(function(err, market){
      res.json({status:1, data:market})
    })
  }
}

exports.editActive = function(req, res) {
  var id = req.query._id;
 MarketActive.find({_id:id}, function(err, market) {
     res.json({data:market[0]})
     })
}


exports.delActive = function(req, res) {
  var id = req.body._id;
 MarketActive.remove({_id:id}, function(err, market) {
     res.json({status:1})
     })
}

// 所有活动
// 由于crm接口写的太乱的原因这里的iwId为批发中心id。crm接口写的乱的惨不忍睹。
exports.synAllActivitys = function(req,res) {
  var iwId = req.params.id;
  params = {iwId:iwId};
  var _aact = null;
  MarketAllActivity.find(params,function(err,aact){
    if (aact && aact.length!=0) {
      _aact = JSON.parse(JSON.stringify(aact));
    };
    getRemoteActivity(iwId,_aact,function(err,count,updateCount,addCount){
      if (err) {
        res.json({code:1,data:err});
        return;
      };
      res.json({code:0,data:{count:count,updateCount:updateCount,addCount:addCount}});
    });
  });
};
exports.saveAAct = function(req,res){
  var id = req.body._id,
      aactobj = req.body;
  console.log(req);
  MarketAllActivity.findById({_id:id},function(err,resaact){
    if (err) {res.json({code:1,data:err})};
    MarketAllActivity.update({_id:id},aactobj,function(err){
      if (err) {res.json({code:1,data:err})};
      res.json({code:0});
    })
  })
};
exports.getAllActivitys = function(req,res) {
  var iwId = req.params.id;
  console.log(123)
  var params = {iwId:iwId};
  MarketAllActivity.find(params,function(err,getaact){
    if (err) {res.json({code:1,data:err});return;};
    res.json({code:0,data:getaact});
  })
};
function getRemoteActivity(id,aactmodel,callBack) {
  if (!callBack) {
    callBack = function() {};
  };
  var params = {wcenterId:id};
  var url = domainCrm + '/cms/wcenter/home/wcenterActivities.cf'
  Superagent.post(url)
    .query(params)
    .end(function(err,res){
      console.log(456);
      if (err) {callBack(err);return;}
      var respone = JSON.parse(res.text);
      var remoteList = respone.data;
      console.log(res);
      if (respone.data.length==0) {callBack(null,0,0,0);return;};
      if (!aactmodel) {
        var iteration = Math.floor(remoteList.length/8);
        var startAt = remoteList.length%8;
        var i = 0;
        do{
          switch(startAt){
            case 0:saveAActModel(remoteList[i++],callBack);
            case 7:saveAActModel(remoteList[i++],callBack);
            case 6:saveAActModel(remoteList[i++],callBack);
            case 5:saveAActModel(remoteList[i++],callBack);
            case 4:saveAActModel(remoteList[i++],callBack);
            case 3:saveAActModel(remoteList[i++],callBack);
            case 2:saveAActModel(remoteList[i++],callBack);
            case 1:saveAActModel(remoteList[i++],callBack);
          }
          startAt = 0;
        }while(--iteration>0);
        callBack(null,remoteList.length,remoteList.length,remoteList.length);
      }else{
        var iteration = Math.floor(aactmodel.length/8),
            startAt = aactmodel.length%8,
            i = 0,
            arr = [],
            _update = 0,
            _add = 0;
        do{
          switch(startAt){
            case 0:arr.push(aactmodel[i++].id);console.log(i);
            case 7:arr.push(aactmodel[i++].id);console.log(i);
            case 6:arr.push(aactmodel[i++].id);console.log(i);
            case 5:arr.push(aactmodel[i++].id);console.log(i);
            case 4:arr.push(aactmodel[i++].id);console.log(i);
            case 3:arr.push(aactmodel[i++].id);console.log(i);
            case 2:arr.push(aactmodel[i++].id);console.log(i);
            case 1:arr.push(aactmodel[i++].id);console.log(i);
          }
          startAt = 0;
        }while(--iteration>0);
        for(var len=remoteList.length;len--;){
          var index = arr.indexOf(remoteList[len].id);
          switch(index!=-1){
            case true:
              _.extend(aactmodel[index],remoteList[len]);
              saveAActModel(aactmodel[index],callBack);
              _update++;
              break;
            default:
              saveAActModel(remoteList[len],callBack);
              _add++;
          }
        }
        callBack(null,remoteList.length,_update,_add);
      }
    });
}
function saveAActModel(obj,callback){
  if (obj._id) {
    var _id = obj._id || null;
    MarketAllActivity.findById(_id,function(err,resobj){
      if (err) {callback(err); return;};
      MarketAllActivity.update({_id:_id},obj,function(err){callback(err)});
    })
  }else{
    var _obj = new MarketAllActivity(obj);
    _obj.save(function(err,res){
      if (callback) {callback(err)};
    })
  }
};

// appAPI
exports.getappmarket = function(req,res){
  var iwId = req.query.iwId;
  var sortId = 'sortId';
  var search = {iwId:iwId,clusterType:2};
  if (!iwId) {
    return res.json({code:1,msg:'marketId is null.'});
  };
  Cluster.find(search)
    .sort(sortId)
    .exec(function(err,_market){
      if (err) {
        console.log(err);
      };
      if (!_market || _market.length==0) {
        return res.json({code:1,msg:'marketId is nonexistent.'})
      };
      var jsonMarket = JSON.parse(JSON.stringify(_market));
      MarketFeedback.find(search)
        .limit(2)
        .sort(sortId)
        .exec(function(err, feedback) {
          if (err) {
            console.log(err)
          };
          if (!feedback || feedback.length==0) {};
          jsonMarket[0].fbs = feedback;
          MarketIndexActive.find({marketId:marketId})
            .limit(4)
            .sort(sortId)
            .exec(function(err, indexActive) {
              if (err) {
                console.log(err)
              };
              if (!indexActive || indexActive.length) {};
              jsonMarket[0].act = indexActive;
              MarketBest.find(search)
                .limit(4)
                .sort(sortId)
                .exec(function(err, best) {
                  if (err) {
                    console.log(err)
                  };
                  if (!best || best.length==0) {
                    jsonMarket[0].seller = [];
                    return Market.find(search).count(function(err,total){
                      res.json({code:0,data:jsonMarket[0],total:total});
                    });
                  };
                  var _best = JSON.parse(JSON.stringify(best));
                  var a = 0;  
                  _best.forEach(function(item, index){
                  MarketBestProduct.find({iwId:iwId,shopId:item.shopId})
                      .limit(3)
                      .sort(sortId)
                      .exec(function(err,product){
                        a++;
                        _best[index].products = product;
                        if (a == _best.length ) {
                          jsonMarket[0].seller = _best;
                          return Market.find(search).count(function(err,total){
                            res.json({code:0,data:jsonMarket[0],total:total});
                          });
                        };
                      });
                    })
                  })
            })
        })

    })
      
}














