/**
 * 栏目首页控制器
 */

var _ = require('underscore');


//引入数据模型
var HomeAct = require('../models/homeAct');
var HomeFastShip = require('../models/homeFastShip');
var IndexFloor = require('../models/indexFloor');
var IndexProduct = require('../models/indexProduct');
var IndexLogo = require('../models/indexLogo');
var IndexLink = require('../models/indexLink');


//获取活动
exports.getAllHomeAct = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {
    sortName = '-' + sortName
  }

  HomeAct.find()
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, homeAct) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return HomeAct.count(function(err, count) {
        res.json({'status':1, data: homeAct, count: count})
      })
    })
}



//添加活动
exports.saveHomeAct = function(req, res) {
 console.log(req);
  var id = req.body._id;
  var homeActObj = req.body;
   
  var _homeAct;
  if (id) {
    console.log("1111");
    HomeAct.findById(id, function(err, homeAct) {
      _homeAct = _.extend(homeAct, homeActObj);
      _homeAct.save(function(err, homeAct) {
        res.json({status:1})
      })
    })
  }else {
     console.log("222;");
    _homeAct = new HomeAct(homeActObj);
    _homeAct.save(function(err, homeAct){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
       console.log(homeAct);
      res.json({status:1, data:homeAct})

     
    })
  }
}


//支持删除
exports.delHomeAct = function(req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    HomeAct.remove({_id: {$in: idsArr}}, function (err, homeAct) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}



//获取快运
exports.getAllHomeFastShipCate = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {
    sortName = '-' + sortName
  }

  HomeFastShip.find()
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, homeFastShip) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return HomeFastShip.count(function(err, count) {
        res.json({'status':1, data: homeFastShip, count: count})
      })
    })
}


//添加快运
exports.saveHomeFastShipCate = function(req, res) {
  var id = req.body._id;
  var homeFastShipObj = req.body;
   
  var _homeFastShip;
  if (id) {
  
    HomeFastShip.findById(id, function(err, homeFastShip) {
      _homeFastShip = _.extend(homeFastShip, homeFastShipObj);
      _homeFastShip.save(function(err, homeFastShip) {
        res.json({status:1})
      })
    })
  }else {
    
    _homeFastShip = new HomeFastShip(homeFastShipObj);
    _homeFastShip.save(function(err, homeFastShip){
     
      res.json({status:1, data:homeFastShip})

     
    })
  }
}



//删除快运
exports.delHomeFastShipCate = function(req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    HomeFastShip.remove({_id: {$in: idsArr}}, function (err, homeFastShip) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}

//获取楼层
exports.get = function(req, res) {
  console.log(11, req.session);
  IndexFloor
    .find({})
    .sort('sortId')
    .exec(function(err, floor){
      if (err) {
        console.log(err);
      }
      res.json({'status':1, 'data': floor})
    });
}
//添加楼层
exports.save = function (req, res) {
  var id = req.body._id
  var floorObj = req.body
  var _floor;

  if (id) {
    IndexFloor.findById(id, function(err, floor){
      _floor = _.extend(floor, floorObj)
      _floor.save(function(err, floor) {
        res.json({status:1})
      });
    })
  } else {
    _floor = new IndexFloor(floorObj);
    _floor.save(function(err, floor){
      console.log(floor);
      res.json({status:1, data: {_id: floor._id}})
    })
  }
}
//删除楼层
exports.del = function (req, res) {
  var id = req.params.id;
  if (id) {
    IndexFloor.remove({_id: id}, function(err, floor){
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
    IndexProduct.findById(id, function(err, product){
      _product = _.extend(product, productObj)
      _product.save(function(err, product) {
        res.json({status:1})
      });
    })
  } else {
    _product = new IndexProduct(productObj);
    _product.save(function(err, product){
      res.json({status:1, data: {_id: product._id}})
    })
  }
}
//添加产品
exports.getProduct = function (req, res) {
  var floorid = req.params.floorid;
  IndexProduct
    .find({'floorid': floorid})
    .sort('sortId')
    .exec(function(err, floor){
      if (err) {
        console.log(err);
      }
      res.json({'status':1, 'data': floor})
    });
}
//删除产品
exports.delProduct = function (req, res) {
  var id = req.params.id;
  if (id) {
    IndexProduct.remove({_id: id}, function(err, product){
      if (err) {
        res.json({status:0,message:err})
      } else {
        res.json({status:1})
      }
    })
  }
}


//添加logo
exports.saveLogo = function (req, res) {
  var id = req.body._id
  var logoObj = req.body
  var _logo;

  if (id) {
    IndexLogo.findById(id, function(err, logo){
      _logo = _.extend(logo, logoObj)
      _logo.save(function(err, logo) {
        res.json({status:1})
      });
    })
  } else {
    _logo = new IndexLogo(logoObj);
    _logo.save(function(err, logo){
      res.json({status:1, data: {_id: logo._id}})
    })
  }
}
//获取logo
exports.getLogo = function (req, res) {
  var floorid = req.params.floorid;
  console.log(222, floorid)
  IndexLogo
    .find({'floorid': floorid})
    .sort('sortId')
    .exec(function(err, floor){
      if (err) {
        console.log(err);
      }
      res.json({'status':1, 'data': floor})
    });
}
//删除logo
exports.delLogo = function (req, res) {
  var id = req.params.id;
  if (id) {
    IndexLogo.remove({_id: id}, function(err, logo){
      if (err) {
        res.json({status:0,message:err})
      } else {
        res.json({status:1})
      }
    })
  }
}



//添加link
exports.saveLink = function (req, res) {
  var id = req.body._id
  var linkObj = req.body
  var _link;

  if (id) {
    IndexLink.findById(id, function(err, link){
      _link = _.extend(link, linkObj)
      _link.save(function(err, link) {
        res.json({status:1})
      });
    })
  } else {
    _link = new IndexLink(linkObj);
    console.log(_link);
    _link.save(function(err, link){
      console.log(link)
      res.json({status:1, data: link})
    })
  }
}
//获取link
exports.getLink = function (req, res) {
  var floorid = req.params.floorid;
  console.log(222, floorid)
  IndexLink.find({'floorid': floorid})
    .sort('sortId')
    .exec(function(err, floor){
      if (err) {
        console.log(err);
      }
      res.json({'status':1, 'data': floor})
    });
}
//删除link
exports.delLink = function (req, res) {
  var id = req.params.id;
  if (id) {
    IndexLink.remove({_id: id}, function(err, link){
      if (err) {
        res.json({status:0,message:err})
      } else {
        res.json({status:1})
      }
    })
  }
}
