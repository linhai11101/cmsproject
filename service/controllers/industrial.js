/**
 * 广贸基地
 * @time 2017/01/06
 */

var mongoose = require('mongoose');
var _ = require('underscore');
var Superagent = require('superagent');


//模型
// var Industrial = require('../models/industrial');
var Cluster = require('../models/cluster');
var IndustrialIndexAct = require('../models/industrialIndexAct');
var industrialIndexWS = require('../models/industrialIndexWS');
var industrialIndexFB = require('../models/industrialIndexFB');
var industrialIndexCate = require('../models/industrialIndexCate');
var industrialTops = require('../models/industrialTops');
var industrialTownMenu = require('../models/industrialTownMenu');
var industrialActivityAct = require('../models/industrialActivityAct');
var industrialActivityBanner = require('../models/industrialActivityBanner');
var industrialTownBanner = require('../models/industrialTownBanner');
var industrialTownAct = require('../models/industrialTownAct');
var industrialTownFB = require('../models/industrialTownFB');
var industrialApp = require('../models/industrialApp');
var industrialAppBanner = require('../models/industrialAppBanner');
var industrialallactivitys = require('../models/industrialallactivitys');
var MarketIndexActive = require('../models/marketIndexActive');
var Ads = require('../models/ads');

var domainCrm = require('../config').java_api_host;
var getQuery = require('../util/getQuery');
//获取基地
exports.get = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var provinceId = req.query.provinceId ? req.query.provinceId : null;
  var cityId = req.query.cityId ? req.query.cityId : null;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  var industryId = req.query.industryId || 1;
  var clusterType = req.query.clusterType;
  var industrialSearch = {'industryId':industryId};
  if (clusterType) {industrialSearch.clusterType = clusterType};
  if (provinceId) industrialSearch.provinceId = provinceId;
  if (cityId) industrialSearch.cityId = cityId;
  if (sortOrder === 'false') sortName = '-' + sortName;
  Cluster.find(industrialSearch)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, industrial) {
      if (err) return res.json({'status':0, 'msg': err});

      if (industrial.length==0) return res.json({'status':0, data:{}});
      var a = 0;
      _industrial = JSON.parse(JSON.stringify(industrial))
      _industrial.forEach(function(item,i){
        IndustrialIndexAct.find({iwId:item.iwId})
          .sort('sortId')
          .exec(function(err,act){
            if (err) {
              console.log(err);
              return;
            };
            industrialIndexWS.find({iwId:item.iwId})
              .sort('sortId')
              .exec(function(err,ws){
                if (err) {
                  console.log(err);
                  return;
                };
                industrialIndexFB.find({iwId:item.iwId})
                 .sort('sortId')
                 .exec(function(err,fb){
                   if (err) {
                     console.log(err);
                     return;
                   };
                   _industrial[i].act = act;
                   _industrial[i].ws = ws;
                   _industrial[i].fb = fb;
                   a++;
                   if (a == _industrial.length) {
                      Cluster.find(industrialSearch).count(function(err, count) {
                        return res.json({'status':1, data:_industrial, count: count,current:current,perPage:perPage,maxPage:Math.ceil(count/perPage)});
                      })
                    }
                 })
              })
          })
      })
    })
}
// 获取专业镇及专业市场
exports.getCluster = function(req,res){
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var provinceId = req.query.provinceId ? req.query.provinceId : null;
  var cityId = req.query.cityId ? req.query.cityId : null;
  var clusterType = req.query.clusterType ? req.query.clusterType : null;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  var industryId = req.query.industryId || 1;
  var industrialSearch = {'industryId':industryId};
  if (provinceId) industrialSearch.provinceId = provinceId;
  if (cityId) industrialSearch.cityId = cityId;
  if (clusterType) industrialSearch.clusterType = clusterType;
  if (sortOrder === 'false') sortName = '-' + sortName;
  Cluster.find(industrialSearch)
    .skip(startRow)
    .limit(perPage)
    .sort('clusterType')
    .sort(sortName)
    .exec(function(err,cluster){
      if (err) {return res.json({status:0,data:err});}
      var a = 0;
      if (cluster.length==0) {
        return res.json({'status':1, data:cluster, count: 0,current:1,perPage:perPage,maxPage:0});
      }
      var _cluster = JSON.parse(JSON.stringify(cluster));
      var MONGOOSE_MODEL = {};
      _cluster.forEach(function(item,i){
        if (item.clusterType == 1) {
          MONGOOSE_MODEL = IndustrialIndexAct;
        }else if (item.clusterType == 2) {
          MONGOOSE_MODEL = MarketIndexActive;
        };
        MONGOOSE_MODEL.find({iwId:item.iwId})
            .sort('sortId')
            .exec(function(err,act){
              if (err) {console.log(err);act = [];}
              _cluster[i].act = act;
              a++;
              if (a == _cluster.length) {
                Cluster.find(industrialSearch).count(function(err,count){
                  if (err) {return res.json({status:0,data:err});}
                  return res.json({'status':1, data:_cluster, count: count,current:current,perPage:perPage,maxPage:Math.ceil(count/perPage)});
                })
              };
            })
      })
    })
}

//获取一条类目
exports.getOne = function(req, res) {
  var id = req.params.id;
  Cluster.findById(id, function(err, industrial) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: industrial})
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
    Cluster.remove({_id: {$in: idsArr}}, function (err, industrial) {
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
  var industrialObj = req.body;
  var _cate;
  if (id) {
    Cluster.findById(id, function(err, industrial) {
      _cate = _.extend(industrial, industrialObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new Cluster(industrialObj);
    _cate.save(function(err, industrial){
      res.json({status:1, data:industrial})
      getRemoteIndustrialShop(industrialObj.id, industrial._id)
    })
  }
}



//获取专业镇分类
exports.getCate = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var sortId = 'sortId';
  industrialIndexCate.find()
    .sort(sortId)
    .exec(function(err, industrialCate) {
      console.log(industrialCate);
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return industrialIndexCate.count(function(err, count) {
        res.json({'status':1, data: industrialCate, count: count});
      })
    })
}
//添加或修改专业镇分类
exports.saveCate = function(req, res) {
  var id = req.body._id;
  var industrialCateObj = req.body;
  var _cate;
  if (id) {
    industrialIndexCate.findById(id, function(err, industrialIndexCate) {
      _cate = _.extend(industrialIndexCate, industrialCateObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    getRemoteIndustrialCate(function(err,count,updateCount){
      if (err) {
        return res.json({status:0,msg:err,msg2:domainCrm});
      }
      res.json({"status":1,"count":count,"updateCount":updateCount})
    })
  }
}

// 专业镇分类远程请求
function getRemoteIndustrialCate(callBack){
  if (!callBack) {
    callBack = function(){};
  };
  
  var url = domainCrm + "/cms/iwIclusters/home/categoryList.cf";
  Superagent.post(url)
    .end(function(err,res){
      if (err) {
        return callBack(err)
      };
      var data  = JSON.parse(res.text);
      if (0 != data.code) {
        return callBack(null,0,0)
      };
       // 清空原来的数据
      industrialIndexCate.remove(function(err,removeres){
        if (err) {
          return callBack(err);
        };
        console.log(removeres);
      });
      var count = 0,updateCount = 0;
      data.data.forEach(function(item,i){
        industrialIndexCate
          .find()
          .exec(function(err,res){
            console.log(res);
            if (err) {
              return callBack(err)
            };
            if (!res.length) {
              var cateObj = {
                id:item.id,
                nameEn:item.nameEn
              }
              var cate = new industrialIndexCate(cateObj);
              cate.save(function(err,res){
                if (err) {
                  return callBack(err);
                };
              })
              updateCount++;
            }
            count++;
            _cb();
          })
      })
      function _cb(){
        console.log(count);
        if (count == data.data.length) {
          callBack(null, count, updateCount)
        }
      }
    })
}

// 删除分类
exports.delCate = function(req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    IndustrialIndexCate.remove({_id: {$in: idsArr}}, function (err, industrialCate) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}
//判断基地是否已经添加
exports.hasIndustrial = function(req, res) {
  var id = req.params.id;
  Cluster.find({id: id})
    .exec(function(err, resIndust) {
      if (resIndust.length) {
        res.json({status: 0})
      } else {
        res.json({status: 1})
      }
    })
}
// 同步专业市场
exports.syncShop = function(req, res) {
  var pid = req.params.id;
  var id = req.body.id;
  getRemoteIndustrialShop(id, pid, function(err, count, updateCount){
    if (err) {
      return res.json({status: 0,msg:err})
    }
    res.json({status:1, count: count, updateCount: updateCount})
  })
}

// 同步专业镇列表
exports.syncZyz = function(req, res) {
  var id = req.body._id;
  var townObj = req.body;
  var _town;
  if (id) {
    Cluster.findById(id,function(err,town){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      _town = _.extend(town,townObj);
      _town.save(function(err,townRes){
        if (err) {
          res.json({status:0,msg:err});
          return;
        };
        res.json({status:1,data:townRes});
      })
    })
  }else{
     getRemoteIndustrialZyz(function(err, count, updateCount){
      if (err) {
        return res.json({status: 0,msg:err})
      };
      res.json({"status":1, "count": count, "updateCount": updateCount})
    })
  }
}
//远程获取专业镇
function getRemoteIndustrialZyz(callBack) {
  if (!callBack) {
    callBack = function(){};
  };

  var url =domainCrm + "/cms/iwIclusters/home/iwIclustersInfo.cf";
  Superagent.post(url)
    .end(function(err, res) {
      if (err) return callBack(err);
      var data = JSON.parse(res.text);
      if (0 != data.code) {
        return callBack(null, 0, 0)
      };
      // 清空原来的数据
      Cluster.remove({clusterType:1},function(err,removeres){
        if (err) {
          return callBack(err);
        };
        console.log(removeres);
      });
      var count = 0, updateCount = 0;
      data.data.forEach(function(item, i) {
        Cluster.find({clusterType:1})
          .exec(function(err, reszyz) {
           
            if (err) return callBack(err);
            if (!reszyz.length){
              var zyzObj = {
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
                  clusterType:1,//clusterType:为1时是专业镇
                  isCollect:false,
                  relateIds:item.relateIds
              };
              var _zyz = new Cluster(zyzObj);
              _zyz.save(function(err, reszyz1){
                if (err) return callBack(err);
              })
              updateCount++
            }
            count++;
            _cb();
          })
      })

      function _cb() {
        if (count == data.data.length) {
          callBack(null, count, updateCount)
        }
      }

    })
}
// 专业镇大首页推荐
exports.saveIndexAct = function(req,res){
  var id = req.body._id;
  var IndexActObj = req.body;
  var _IndexAct;
  if (id) {
    IndustrialIndexAct.findById(id,function(err,indexAct){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      _IndexAct = _.extend(indexAct,IndexActObj);
      _IndexAct.save(function(err,act){
        if (err) {
        res.json({status:0,msg:err});
        return;
      };
        res.json({status:1});
      })
    })
  }else{
    _IndexAct = new IndustrialIndexAct(IndexActObj);
    _IndexAct.save(function(err,act){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1,data:act});
    })
  }
}
exports.saveIndexWS = function(req,res){
  var id = req.body._id;
  var IndexWSObj = req.body;
  var _IndexWS;
  if (id) {
    industrialIndexWS.findById(id,function(err,indexWS){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      _IndexWS = _.extend(indexWS,IndexWSObj);
      _IndexWS.save(function(err,ws){
        if (err) {
          res.json({status:0,msg:err});
          return;
        };
        res.json({status:1})
      })
    })
  }else{
    _IndexWS = new industrialIndexWS(IndexWSObj);
    _IndexWS.save(function(err,ws){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1,data:ws});
    })
  }
}
exports.saveIndexFB = function(req,res){
  var id = req.body._id;
  var IndexFBObj = req.body;
  var _IndexFB;
  if (id) {
    industrialIndexFB.findById(id,function(err,indexFB){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      _IndexFB = _.extend(indexFB,IndexFBObj);
      _IndexFB.save(function(err,fb){
        if (err) {
          res.json({status:0,msg:err});
          return;
        };
        res.json({status:1});
      })
    })
  }else{
    _IndexFB = new industrialIndexFB(IndexFBObj);
    _IndexFB.save(function(err,fb){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1,data:fb});
    })
  }
}
exports.getIndexAct = function(req,res){
  var id = req.params.id;
  var sortid = 'sortId';
  var search = {
    iwId:id
  };
  IndustrialIndexAct.find(search)
    .sort(sortid)
    .exec(function(err,act){
      if (err) {
        return res.json({'status':0,'msg':err});
      };
      return IndustrialIndexAct.find(search).count(function(err,count){
        res.json({status:1, data:act, count:count});
      });
    })
}
exports.getIndexWS = function(req,res){
  var id = req.params.id;
  var sortid = 'sortId';
  var search = {
    iwId:id
  };
  industrialIndexWS.find(search)
    .sort(sortid)
    .exec(function(err,ws){
      if (err) {
        return res.json({'status':0,'msg':err});
      };
      return industrialIndexWS.find(search).count(function(err,count){
        res.json({status:1, data:ws, count:count});
      });
    })


}
exports.getIndexFB = function(req,res){
  var id = req.params.id;
  var sortid = 'sortId';
  var search = {
    iwId:id
  };
  console.log(id);
  industrialIndexFB.find(search)
    .sort(sortid)
    .exec(function(err,fb){
      if (err) {
        return res.json({status:0,msg:err});
      };
      return industrialIndexFB.find(search).count(function(err,count){
        res.json({status:1, data:fb, count:count});
      });
    })


}
exports.delIndexAct = function(req,res){
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',');
  };
  console.log(ids);
  if (idsArr.length) {
    IndustrialIndexAct.remove({_id:{$in:idsArr}},function(err,_res){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1});
    })
  }

}
exports.delIndexWS = function(req,res){
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',');
  };
  console.log(ids);
  if (idsArr.length) {
    industrialIndexWS.remove({_id:{$in:idsArr}},function(err,_res){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1});
    })
  }

}
exports.delIndexFB = function(req,res){
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',');
  };
  console.log(ids);
  if (idsArr.length) {
    industrialIndexFB.remove({_id:{$in:idsArr}},function(err,_res){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1});
    })
  }

}


//保存top100
exports.saveTops = function(req,res){
  var id = req.body._id;
  var top100Obj = req.body;

  var _top100;
  if (id) {
    industrialTops.findById(id,function(err,top100){
      _top100 = _.extend(top100,top100Obj);
      _top100.save(function(err,top){
        res.json({status:1});
      })
    })
  }else{
    _top100 = new industrialTops(top100Obj);
    _top100.save(function(err,top){
      res.json({status:1,data:top});
    })
  }
}
// 获取top100
exports.getTops = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 20;
  var startRow = (current - 1)*perPage;
  var sortId = 'sortId';
  var iwId = req.params.id;
  var search = {
    iwId: iwId
  };
  industrialTops.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortId)
    .exec(function(err, top100) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return industrialTops.find(search).count(function(err, count) {
        res.json({'status':1, data: top100, count: count, current:current, perPage:perPage});
      })
    })
}
// 删除top100。支持批量删除，用逗号分开。
exports.delTops = function(req,res){
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',');
  };
  if (idsArr.length) {
    industrialTops.remove({_id:{$in:idsArr}},function(err,topRes){
      if (err) {
        res.json({'status':0,'msg':err});
        return;
      };
      res.json({'status':1})
    })
  }
}
//保存专业镇分类菜单&&删除专业镇分类二级菜单
exports.saveTownMenu = function(req,res){
  var _TownMenuObj = req.body.data;
  var TownMenuObj = JSON.parse(_TownMenuObj);
  var id = TownMenuObj._id;
  var _townMenu;
  console.log(TownMenuObj);
  if (id) {
    industrialTownMenu.findById(id,function(err,townMenu){
      _townMenu = _.extend(townMenu,TownMenuObj);
      console.log(_townMenu);
      _townMenu.save(function(err,menu){
        res.json({status:1});
      })
    })
  }else{
    _townMenu = new industrialTownMenu(TownMenuObj);
    _townMenu.save(function(err,menu){
      res.json({status:1,data:menu});
    })
  }
} 
// 获取专业镇分类菜单
exports.getTownMenu = function(req,res){
  var sortId = 'sortId';
  var iwId = req.params.id;
  var search = {
    iwId: iwId
  };
  industrialTownMenu.find(search)
    .sort(sortId)
    .exec(function(err,townMenus){
      if (err) {
        return res.json({'status':0,'msg':err});
      };
      return industrialTownMenu.find(search).count(function(err,count){
        res.json({'status':1, 'data':townMenus,'count':count});
      }) 
    })
}
// 删除专业镇分类菜单
exports.delTownCate = function(req,res){
  var ids = req.params.ids;
  console.log(req);
  if (ids) {
    industrialTownMenu.remove({_id:ids},function(err,townMenuRes){
      if (err) {
        res.json({'status':0,'msg':err});
        return;
      };
      res.json({'status':1,'data':townMenuRes});
    })
  }

}
//专业镇banner
exports.saveTownBanner = function(req, res) {
  var id = req.body._id;
  var bannerObj = {
    townActBN: req.body
  };
  
   var _banner;
  if (id) {
    Cluster.findById(id, function(err, banner) {

      _banner = _.extend(banner, bannerObj);
      _banner.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _banner = new Cluster(bannerObj);
    
    _banner.save(function(err, banner){
      res.json({status:1, data:banner})
    })
  }
}
// 活动页面推荐
exports.saveActivityAct = function(req,res){
  var id = req.body._id;
  var actObj = req.body;
  var _act;
  if (id) {
    industrialActivityAct.findById(id,function(err,act){
      if (err) {
        res,json({status:0,msg:err});
        return;
      };
      _act = _.extend(act,actObj);
      _act.save(function(err,acti){
        if (err) {
          res.json({status:0,msg:err});
          return;
        };
        res.json({status:1,data:acti});
      })
    })
  }else{
    _act = new industrialActivityAct(actObj);
    _act.save(function(err,act){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1,data:act});
    })
  }

}
exports.saveActivityBanner = function(req,res){
  var id = req.body._id;
  var bannerObj = req.body;
  var _bn;
  if (id) {
    industrialActivityBanner.findById(id,function(err,bn){
      if (err) {
        res,json({status:0,msg:err});
        return;
      };
      _bn = _.extend(bn,bannerObj);
      _bn.save(function(err,bni){
        if (err) {
          res,json({status:0,msg:err});
          return;
        };
        res.json({status:1});
      })
    })
  }else{
    _bn = new industrialActivityBanner(bannerObj);
    _bn.save(function(err,bn){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1,data:bn});
    })
  }

}
exports.getActivityAct = function(req,res){
  var iwId = req.params.id;
  var sortId = 'sortId';
  var search = {
    iwId:iwId
  };
  industrialActivityAct.find(search)
    .sort(sortId)
    .exec(function(err,activityAct){
      if (err) {
        return res.json({status:0,msg:err});
      };
      return industrialActivityAct.find(search).count(function(err,count){
        res.json({status:1, data:activityAct, count:count});
      })
    })
}
exports.getActivityBanner = function(req,res){
  var iwId = req.params.id;
  var sortId = 'sortId';
  var search = {
    iwId:iwId
  };
  industrialActivityBanner.find(search)
    .sort(sortId)
    .exec(function(err,activityBanner){
      if (err) {
        return res.json({status:0,msg:err});
      };
      return industrialActivityBanner.find(search).count(function(err,count){
        res.json({status:1, data:activityBanner, count:count});
      })
    })
}
exports.delActivityAct = function(req,res){
  var ids = req.params.ids;
  console.log(req);
  if (ids) {
    industrialActivityAct.remove({_id:ids},function(err,actRes){
      if (err) {
        res.json({status:0, msg:err});
        return;
      };
      res.json({status:1, data:actRes});
    })
  }
}
exports.delActivityBanner = function(req,res){
  var ids = req.params.ids;
  console.log(req);
  if (ids) {
    industrialActivityBanner.remove({_id:ids},function(err,bannerRes){
      if (err) {
        res.json({status:0, msg:err});
        return;
      };
      res.json({status:1, data:bannerRes});
    })
  }
}
exports.saveTownBanner = function(req,res){
  var id = req.body._id;
  var tbannerObj = req.body;
  var _tbanner;
  if (id) {
    industrialTownBanner.findById(id,function(err,tbanner){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      _tbanner = _.extend(tbanner,tbannerObj);
      _tbanner.save(function(err,tbanneri){
        if (err) {
          res.json({status:0,msg:err});
          return;
        };
        res.json({status:1})
      })
    })
  }else{
    _tbanner = new industrialTownBanner(tbannerObj);
    _tbanner.save(function(err,newtbanner){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1, data:newtbanner});
    })
  }
}
exports.saveTownAct = function(req,res){
  var id = req.body._id;
  var tactObj = req.body;
  var _tact;
  if (id) {
    industrialTownAct.findById(id,function(err,tact){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      _tact = _.extend(tact,tactObj);
      _tact.save(function(err,tacti){
        if (err) {
          res.json({status:0,msg:err});
          return;
        };
        res.json({status:1});
      })
    })
  }else{
    _tact = new industrialTownAct(tactObj);
    _tact.save(function(err,newtact){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1,data:newtact});
    })
  }
}
exports.saveTownFB = function(req,res){
  var id = req.body._id;
  var tfbObj = req.body;
  var _tfb;
  if (id) {
    industrialTownFB.findById(id,function(err,tfb){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      _tfb = _.extend(tfb,tfbObj);
      _tfb.save(function(err,tfbi){
        if (err) {
          res.json({status:0,msg:err});
          return;
        };
        res.json({status:1});
      })
    })
  }else{
    _tfb = new industrialTownFB(tfbObj);
    _tfb.save(function(err,newtfb){
      if (err) {
        res.json({status:0,msg:err});
      };
      res.json({status:1,data:newtfb});
    })
  }
}
exports.getTownBanner = function(req,res){
  var iwId = req.params.id;
  var sortId = 'sortId';
  var search = {
    iwId:iwId
  };
  industrialTownBanner.find(search)
    .sort(sortId)
    .exec(function(err,townBanner){
      if (err) {
        return res,json({status:0,msg:err});
      };
      return industrialTownBanner.find(search).count(function(err,count){
        res.json({status:1,data:townBanner,count:count});
      })
    })

}
exports.getTownAct = function(req,res){
  var iwId = req.params.id;
  var sortId = 'sortId';
  var search = {
    iwId:iwId
  };
  industrialTownAct.find(search)
    .sort(sortId)
    .exec(function(err,townAct){
      if (err) {
        return res,json({status:0,msg:err});
      };
      return industrialTownAct.find(search).count(function(err,count){
        res.json({status:1,data:townAct,count:count});
      })
    })

}
exports.getTownFB = function(req,res){
  var iwId = req.params.id;
  var sortId = 'sortId';
  var search = {
    iwId:iwId
  };
  industrialTownFB.find(search)
    .sort(sortId)
    .exec(function(err,townFB){
      if (err) {
        return res,json({status:0,msg:err});
      };
      return industrialTownFB.find(search).count(function(err,count){
        res.json({status:1,data:townFB,count:count});
      })
    })

}
exports.delTownBanner = function(req,res){
  var ids = req.params.ids;
  if (ids) {
    industrialTownBanner.remove({_id:ids},function(err,townBannerRes){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1,data:townBannerRes});
    })
  }

}
exports.delTownAct = function(req,res){
  var ids = req.params.ids;
  if (ids) {
    industrialTownAct.remove({_id:ids},function(err,TownActRes){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1,data:TownActRes});
    })
  }

}
exports.delTownFB = function(req,res){
  var ids = req.params.ids;
  if (ids) {
    industrialTownFB.remove({_id:ids},function(err,townFBRes){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      res.json({status:1,data:townFBRes});
    })
  }

}


// app
exports.saveAppRecommon = function(req,res){
  console.log(req);
  var id = req.body._id;
  var appObj = req.body;
  var _app;
  if (id) {
    industrialApp.findById(id,function(err,app){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      _app = _.extend(app,appObj);
      _app.save(function(err,appi){
        if (err) {
          res.json({status:0,msg:err});
        };
        res.json({status:1,data:appi});
      })
    })
  }else{
    _app = new industrialApp(appObj);
    _app.save(function(err,app){
      if (err) {
        res.json({status:0,msg:err});
      };
      res.json({status:1,data:app});
    })
  }
}
exports.getAppRecommon = function(req,res){
  var iwId = req.params.id;
  var sortId = 'sortId';
  var search = {
    iwId:iwId
  };
  industrialApp.find(search)
    .sort(sortId)
    .exec(function(err,app){
      if (err) {
        return res.json({status:0,msg:err});
      };
      return industrialApp.find(search).count(function(err,count){
        res.json({status:1,data:app,count:count});
      })
    })
}
exports.delAppRecommon = function(req,res){
  var ids = req.params.ids;
  if (ids) {
    industrialApp.remove({_id:ids},function(err,appRes){
      if (err) {
        res.json({status:0,msg:err});
      };
      res.json({status:1,data:appRes});
    })
  }


}
// 
exports.saveAppBanner = function(req,res){
  console.log(req);
  var id = req.body._id;
  var appbannerObj = req.body;
  var _appbanner;
  if (id) {
    industrialAppBanner.findById(id,function(err,appbanner){
      if (err) {
        res.json({status:0,msg:err});
        return;
      };
      _appbanner = _.extend(appbanner,appbannerObj);
      _appbanner.save(function(err,appbanneri){
        if (err) {
          res.json({status:0,msg:err});
        };
        res.json({status:1,data:appbanneri});
      })
    })
  }else{
    _appbanner = new industrialAppBanner(appbannerObj);
    _appbanner.save(function(err,appbanner){
      if (err) {
        res.json({status:0,msg:err});
      };
      res.json({status:1,data:appbanner});
    })
  }

}
exports.getAppBanner = function(req,res){
  var industryId = req.params.id;
  var sortId = 'sortId';
  var search = {
    industryId:industryId
  };
  industrialAppBanner.find(search)
    .sort(sortId)
    .exec(function(err,appbanner){
      if (err) {
        return res,json({status:0,msg:err});
      };
      return industrialAppBanner.find(search).count(function(err,count){
        res.json({status:1,data:appbanner,count:count});
      })
    })

}
exports.delAppBanner = function(req,res){
  var ids = req.params.ids;
  if (ids) {
    industrialAppBanner.remove({_id:ids},function(err,appRes){
      if (err) {
        res.json({status:0,msg:err});
      };
      res.json({status:1,data:appRes});
    })
  }

}
// 所有活动
exports.synAllActivitys = function(req,res) {
  var iwId = req.params.id;
  params = {iwId:iwId};
  var _aact = null;
  industrialallactivitys.find(params,function(err,aact){
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
  industrialallactivitys.findById({_id:id},function(err,resaact){
    if (err) {res.json({code:1,data:err})};
    industrialallactivitys.update({_id:id},aactobj,function(err){
      if (err) {res.json({code:1,data:err})};
      res.json({code:0});
    })
  })
};
exports.getAllActivitys = function(req,res) {
  var iwId = req.params.id;
  console.log(123)
  var params = {iwId:iwId};
  industrialallactivitys.find(params,function(err,getaact){
    if (err) {res.json({code:1,data:err});return;};
    res.json({code:0,data:getaact});
  })
};
function getRemoteActivity(id,aactmodel,callBack) {
  if (!callBack) {
    callBack = function() {};
  };
  var params = {iwId:id};
  var url = domainCrm + '/cms/iwIclusters/activity.cf'
  Superagent.get(url)
    .query(params)
    .end(function(err,res){
      if (err) {callBack(err);return;}
      var respone = JSON.parse(res.text);
      var remoteList = respone.data;
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
    industrialallactivitys.findById(_id,function(err,resobj){
      if (err) {callback(err); return;};
      industrialallactivitys.update({_id:_id},obj,function(err){callback(err)});
    })
  }else{
    var _obj = new industrialallactivitys(obj);
    _obj.save(function(err,res){
      if (callback) {callback(err)};
    })
  }
};

// app API
exports.getapptops = function(req,res){
  var page,pageSize,query,startRow,sortId = 'sortId',search = {};
  query = getQuery(req,{page:"Number",pageSize:"Number",id:"Number"});
  page = query.page > 0 ? query.page : 1;
  pageSize = query.pageSize > 0 ? query.pageSize : 10;
  startRow = (page - 1)*pageSize;
  search.iwId = query.id;
  industrialTops.find(search)
    .skip(startRow)
    .limit(pageSize)
    .sort(sortId)
    .exec(function(err, top100) {
      if (err) {
        return res.json({code:1, 'msg': err});
      };
      if (!top100 || top100.length==0) {
        return res.json({code:0, data: [], total: 0, page:1, pageSize:0});
      };
      return industrialTops.find(search).count(function(err, total) {
        res.json({code:0, data: top100, total: total, page:page, pageSize:pageSize,maxPage:Math.ceil(total/pageSize)});
      })
    })
}
exports.getIndustrialappArea = function(req, res) {
  var provinceId,cityId,clusterType,query,sortId = 'sortId',newindustrialCate=[],industrialSearch = {};
  query = getQuery(req,{provinceId:"",cityId:"",clusterType:""})
  provinceId = query.provinceId ? query.provinceId : null;
  cityId = query.cityId ? query.cityId : null;
  clusterType = query.clusterType ? query.clusterType : null;

  if (provinceId) industrialSearch.provinceId = provinceId;
  if (cityId) industrialSearch.cityId = cityId;
  if (clusterType) industrialSearch.clusterType = clusterType;
  industrialIndexCate.find({state:1})
    .sort(sortId)
    .exec(function(err, industrialCate) {
    var industrialCate=JSON.parse(JSON.stringify(industrialCate));
    var a = 0;
    if (err) {return res.json({code:1, 'msg': err})};
    if (!industrialCate || industrialCate.length==0) {return res.json({code:0, data: {banner:[],list:[]}, total: 0})};
    industrialIndexCate.find({state:1}).count(function(err, count) {
      Ads.find({'area':8,'ishidden':1})
        .sort('sortid')
        .limit(5)
        .exec(function(err, resAds) {
          if (err) return res.json({code:1,msg:err});
            bannerList  = resAds;
        })
        industrialCate.forEach(function(value, index){
        industrialSearch.industryId= value.id;
        Cluster.find(industrialSearch)
            .sort('sortId')
            .exec(function(err, item){
              a++
              if (err) return res.json({code:1,msg:err});
              industrialCate[index].list = item;
                if(a==industrialCate.length){
                  return res.json({code:0, data: {banner:bannerList,list:industrialCate},total: count})
                }
            })
          })
        }) 
    })
}

exports.getappcate = function(req,res){
  var page,pageSize,startRow,query,sortId = 'sortId';
  query = getQuery(req,{page:"Number",pageSize:"Number"})
  page = query.page > 0 ? query.page : 1;
  pageSize = query.pageSize > 0 ? query.pageSize : 6;
  startRow = (page - 1)*pageSize;
  console.log(query);
  industrialIndexCate.find({state:1})
    .skip(startRow)
    .limit(pageSize)
    .sort(sortId)
    .exec(function(err, industrialCate) {
      if (err) {
        return res.json({code:1, 'msg': err});
      };
      if (!industrialCate || industrialCate.length==0) {
        return res.json({code:0, data: [], total: 0,page:page,pageSize:pageSize,maxPage:Math.ceil(0/pageSize)});
      };
      return industrialIndexCate.find({state:1}).count(function(err, total) {
        res.json({code:0, data: industrialCate, total: total,page:page,pageSize:pageSize,maxPage:Math.ceil(total/pageSize)})
      })
    })
}
// exports.getapp = function(req,res){
//   var page,pageSize,sortName,sortOrder,industryId,provinceId,cityId,startRow,search = {};

//   if (req.method=='POST') {
//     page = ~~req.body.page > 0 ? ~~req.body.page : 1;
//     pageSize = ~~req.body.pageSize > 0 ? ~~req.body.pageSize : 10;
//     sortName = req.body.shortName || 'sortId';
//     sortOrder = req.body.sortOrder;
//     industryId = req.body.industryId || 10;
//     provinceId = req.body.provinceId ? req.body.provinceId : null;
//     cityId = req.body.cityId ? req.body.cityId : null;
//   }else{
//     page = ~~req.query.page > 0 ? ~~req.query.page : 1;
//     pageSize = ~~req.query.pageSize > 0 ? ~~req.query.pageSize : 10;
//     sortName = req.query.shortName || 'sortId';
//     sortOrder = req.query.sortOrder;
//     industryId = req.query.industryId || 10;
//     provinceId = req.query.provinceId ? req.query.provinceId : null;
//     cityId = req.query.cityId ? req.query.cityId : null;
//   }
//   var startRow = (page - 1)*pageSize;
//   var search = {
//     'industryId':industryId,
//     'clusterType':1
//   };
//   search.industryId = industryId
//   if (sortOrder === 'false') {sortName = '-' + sortName};
//   if (provinceId) {search.provinceId = provinceId;};
//   if (cityId) {search.cityId = cityId;};
//   Cluster.find(search)
//     .skip(startRow)
//     .limit(pageSize)
//     .sort(sortName)
//     .exec(function(err, industrial) {
//       if (err) {
//         return res.json({code:1, 'msg': err});
//       };
//       if (!industrial || industrial.length==0) {
//         return res.json({code:0, data: [], total: 0,page:0, pageSize:0,maxPage:0});
//       };
//       var _industrial = JSON.parse(JSON.stringify(industrial));
//       var a = null;
//       _industrial.forEach(function(item,i){
//         industrialApp.find({iwId:item.iwId})
//           .limit(3)
//           .sort('sortId')
//           .exec(function(err,app){
//             if (err) {
//               return res.json({code:0,msg:err});
//             };
//             if (!app || app.length==0) {
//               _industrial[i].apprecommon=[];
//             }else{
//               _industrial[i].apprecommon = app; 
//             };
//             a++;
//             if (a == _industrial.length) {
//               return Industrial.find({'industryId':industryId}).count(function(err, total) {
//                 res.json({code:0, data: _industrial, total: total,page:page, pageSize:pageSize,maxPage:Math.ceil(total/pageSize)});
//               })
//             }
//           })
//       })
//     })
// }
exports.getappbanners = function(req,res){
  var industryId,query,search = {},sortId = 'sortId';
  query = getQuery(req,{industryId:"Number"})
  industryId = query.industryId || 10;
  search.industryId = industryId;
  industrialAppBanner.find(search)
    .sort(sortId)
    .exec(function(err, appbanners) {
      if (err) {
        return res.json({code:1, 'msg': err});
      }
      if (!appbanners || appbanners.length==0) {
        return res.json({code:0, data: [], total: 0});
      };
      return industrialAppBanner.find(search).count(function(err, total) {
        res.json({code:0, data: appbanners, total: total});
      })
    })
}
exports.getapptowns = function(req,res){
  var iwId,query,search = {clusterType:1},sortId = 'sortId';
  query = getQuery(req,{iwId:""})
  iwId = query.iwId;
  search.iwId = iwId;
  if (!iwId) {
    return res.json({code:1,msg:'iwId is null.'});
  };
  Cluster.find(search)
    .sort(sortId)
    .exec(function(err,town){
      if (err) {
        return res.json({code:1,'msg':err});
      };
      var _town = JSON.parse(JSON.stringify(town))
      industrialTops.find(search)
        .sort(sortId)
        .exec(function(err,tops){
          if (err) {
            return res.json({code:1,'msg':err});
          };
          _town[0].tops = tops;
          industrialTownAct.find(search)
            .sort(sortId)
            .limit(4)
            .exec(function(err, act) {
              if (err) {
                return res.json({code:1,'msg':err});
              };
              _town[0].act = act;
              Cluster.find({iwId:iwId,clusterType:2})
                .limit(4)
                .sort(sortId)
                .exec(function(err, markets) {
                  if (err) {
                    return res.json({code:1,'msg':err});
                  };
                  _town[0].markets = markets;
                  industrialTownFB.find(search)
                    .sort(sortId)
                    .limit(2)
                    .exec(function(err, fbs) {
                      console.log(fbs);
                      if (err) {
                        return res.json({code:1,'msg':err});
                      };
                      _town[0].fbs = fbs;
                      return res.json({code:0,data:_town[0]});
                    })
                })

            })
        })
    })
}
