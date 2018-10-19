var _ = require('underscore');
var eventproxy = require('eventproxy');

var redis = require('../util/redis');
var toTreeData = require('../util/tree').toTreeData;

//模型
var Category = require('../models/category');
var Ads = require('../models/ads');
var Product = require('../models/product');
var Shops = require('../models/shops');

//首页
var HomeAct = require('../models/homeAct');
var HomeFastShip = require('../models/homeFastShip');
var IndexFloor = require('../models/indexFloor');
var IndexProduct = require('../models/indexProduct');
var IndexLogo = require('../models/indexLogo');
var IndexLink = require('../models/indexLink');

//样品中心
var Sample = require('../models/sample');
var SampleProduct = require('../models/sampleProduct');

//产业集群
// var Industrial = require('../models/industrial');
var Cluster = require('../models/cluster');
// 模型(options:2017-01-07)
var IndustrialIndexCate = require('../models/industrialIndexCate');
var IndustrialIndexAct = require('../models/industrialIndexAct');
var IndustrialIndexWS = require('../models/industrialIndexWS');
var IndustrialIndexFB = require('../models/industrialIndexFB');

var IndustrialActivityAct = require('../models/industrialActivityAct');
var IndustrialActivityBanner = require('../models/industrialActivityBanner');


var IndustrialTownMenu = require('../models/industrialTownMenu');
var IndustrialTownMenu = require('../models/industrialTownMenu');
var IndustrialTops = require('../models/industrialTops');
var IndustrialTownBanner = require('../models/industrialTownBanner');
var IndustrialTownAct = require('../models/industrialTownAct');
var IndustrialTownFB = require('../models/industrialTownFB');
var IndustrialAllActivitys = require('../models/industrialallactivitys');

//专业市场
//var Market = require('../models/market');
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
var MarketCate = require('../models/marketCate');
var MarketAllActivitys = require('../models/marketallactivitys');
var MarketMenu = require('../models/marketMenu');
var MarketProduct = require('../models/marketProduct');
var MarketFloor = require('../models/marketFloor');
var MarketContentFloor = require('../models/marketContentFloor');
//促销管理
var SpecialBanner = require('../models/specialBanner');
var SpecialCate = require('../models/specialCate');
var SpecialProduct = require('../models/specialProduct');
// 快速航运
var FastShipIndexModule = require('../models/fastshipindexmodule');
var FastShipIndexFloor = require('../models/fastshipindexfloor');
var FastShipIndexFloorPro = require('../models/fastshipindexfloorpro');
var FastShipIndexFloorCate = require('../models/fastshipindexfloorcate');
var FastShipChennalCate = require('../models/fastshipchennalcate');
var FastShipFirstStair = require('../models/fastshipfirststair');
var FastShipSecStair = require('../models/fastshipsecstair');
var FastShipThrStair = require('../models/fastshipthrstair');
var FastShipProduct = require('../models/fastshipproduct');


// 创新设设计
var InnovativeBanner = require('../models/innovativeBanner');
var Innovative= require('../models/innovative');
var InnovativeProduct = require('../models/innovativeProduct');


//首页
exports.index = function (req, res) {
  var ep = new eventproxy();
  var type = req.query.type;
  //var industrys, categorys, ads;

  ep.all('categorys', 'ads','fastShipcate','specialProduct','innovativePro','products','industrys','homeActs',
   function(categorys, ads,fastShipcate,specialProduct,innovativePro,products,industrys,homeAct){
     var resDate = {
        title: '首页',
        industrys: industrys,
        categorys: categorys,
        ads: ads,
        fastShipcate:fastShipcate,
        specialProduct:specialProduct,
        innovativePro:innovativePro,
        products:products,
        homeActs:homeAct
        

      }
      res.type('.html');
      res.render('index', resDate);
  })



  //专业镇推荐
  Cluster.find({'isTop':0})
    .exec(function(err, recommend){
      if (err) {
        console.log(err);
      }

      ep.emit('industrys', recommend||[]);
    });


  //活动推荐

  HomeAct.find()
    .limit(5)
    .sort('sortId')
    .exec(function(err, recommend){
      if (err) {
        console.log(err);
      }

      ep.emit('homeActs', recommend||[]);
    });

  //类目
  category(function(ress){
    console.log(ress);
    ep.emit('categorys', ress || []);
  })


  //快速航运

    HomeFastShip.find()
    .limit(5)
    .sort('sortId')
    .exec(function(err, recommend){
      if (err) {
        console.log(err);
      }
     

         
      ep.emit('fastShipcate', recommend||[]);
    });
  //产品推荐

 Product.find({'type':1, 'area':1})
    .limit(6)
    .exec(function(err, recommend){
      if (err) {
        console.log(err);
      }
       if(!recommend || !recommend.length) {
            ep.emit('products',  []);
            return false;
         }

      ep.emit('products', recommend||[]);
    });



  Ads.find({'ishidden':1, 'area':1})
    .sort('sortid')
    .limit(10)
    .exec(function(err, resAds){
      if (err) resAds = [];
      if (!resAds || resAds.length == 0) resAds = [];

      resAds = JSON.parse(JSON.stringify(resAds));
      ep.emit('ads', resAds);

      // Ads.find({area:10}).sort("sortid").exec(function(err,fairRes){
      //   if (err) fairRes = [];

      //   if (!fairRes || fairRes.length == 0) fairRes = [];

      //   fairRes = JSON.parse(JSON.stringify(fairRes));

      //   var _ARR = [].concat(resAds,fairRes);

      //   ep.emit('ads', _ARR);

      // })

      
    });


  //促销产品
  SpecialProduct.find({'isTop':1,'isrecommend':0})
   
    .limit(3)
    .exec(function(err, recommend){
      if (err) {
        console.log(err);
      }

      ep.emit('specialProduct', recommend || []);
    });



  //新品设计
  InnovativeProduct.find({'isTop':0})
    .limit(3)
    .exec(function(err, recommend){
      if (err) {
        console.log(err);
      }

      ep.emit('innovativePro', recommend || []);
    });
}

//买家保护
exports.protect = function (req, res) {
  var ep = new eventproxy();
  var type = req.query.type;
  ep.all('categorys',  function( categorys) {
    var resDate = {
      categorys: categorys
    }
    if (type == 'json') {
      res.json(resDate)
    } else {
      res.type('.html');
      res.render('protect', resDate);
    }
  });
 
 //类目
  category(function(ress){
    console.log(ress);
    ep.emit('categorys', ress || []);
  })

}

//样品中心
exports.sample = function (req, res) {
  var ep = new eventproxy();
  //var categorys, samples, ads;
  var type = req.query.type;
  ep.all('samples', 'categorys', 'ads', 'recommend', function(samples, categorys, ads, recommend) {
    var resDate = {
      title: '光贸网',
      floors: samples,
      categorys: categorys,
      ads: ads,
      recommend: recommend
    }
    if (type == 'json') {
      res.json(resDate)
    } else {
      res.type('.html');
      res.render('sample', resDate);
    }
  });

  //样品数据
  Sample.find({'state':1})
    .sort('sortId')
    .limit(5)
    .exec(function(err, resSample){
      if (err) {
        console.log(err);
      }

      var a = 0;
      resSample = JSON.parse(JSON.stringify(resSample));
      if(!resSample || !resSample.length) {
        ep.emit('samples', [])
      }
      resSample.forEach(function(value, index){
        //产品
        SampleProduct.find({'isTop':1,'pid': value._id})
          .sort('sortId')
          .exec(function(err, product){
            a++
            if (err) {
              console.log(err);
            }
            resSample[index].products = product;
            if (a == resSample.length ) {
              ep.emit('samples', resSample)
            }
          });
      });
    });

   //类目
  category(function(ress){
    console.log(ress);
    ep.emit('categorys', ress || []);
  })

  //推荐产品
  //推荐产品
  Product.find({'ishidden':1,'area': 2, 'type': 1})
    .sort('sortid')
    .limit(5)
    .exec(function(err, res){
      if (err) console.log(err);
      ep.emit('recommend', res)
    })

  //广告
  Ads.find({'ishidden':1, 'area':2})
    .sort('sortid')
    .exec(function(err, resAds){
      if (err) {console.log(err); }
      ep.emit('ads', resAds)
    });
}
//专业镇参观评论列表
exports.industrialCommentList = function(req,res){
  var iwId = req.params.id;
  var path = req.path;
  var search = {
    iwId:iwId,
    clusterType:1
  };
  Cluster.find(search, function(err, industrial) {
    if (err) {
      console.log(err);
    }
    res.render('industrial/industrial-comment-list', {
      iwId:iwId,
      base: industrial,
      path: path,
      logo: industrial.logo,
      clusterType:1
    })
  });
}

//专业镇参观评论详情
exports.industrialCommentDetial = function(req, res) {

  var iwId = req.params.id;
  var detailId = req.params.detailId;
  var path = req.path;
  var search = {
    iwId:iwId,
    clusterType:1
  };
  Cluster.find(search, function(err, industrial) {
    if (err) {
      console.log(err);
    };
    if (!industrial || !industrial.length) {
      industrial = {logo:''};
    };
    res.render('industrial/industrial-comment-detail', {
      base: industrial,
      path: path,
      detailId:detailId,
      logo: industrial.logo,
      iwId:iwId,
      clusterType:1
    })
  });
}
// 专业镇产品
exports.industrialProducts = function(req,res){
  var ep = new eventproxy();
  var iwId = req.params.id;
  var cateId = req.params.cateId;
  var path = req.path;
  var _type = req.query.type || null;
  var search = {
    iwId:iwId,
    clusterType:1
  };
  ep.all('base', 'category',function(base,category){
    res.type('.html');
    res.render('industrial/industrial-products',{
      base:base,
      category:category,
      cateId:cateId,
      path:path,
      iwId:iwId,
      clusterType:1,
        type:_type
    })
  });

    Cluster.find(search,function(err,industrial){
      if (err) {
        console.log(err);
      };
      if (!industrial || !industrial.length) {
        ep.emit('base',[]);
        return false;
      };
      ep.emit('base',industrial);
    })

  IndustrialTownMenu.find(search)
    .sort('sortId')
    .exec(function(err, _category) {
      if (err) {
        console.log(err)
      };
      if (!_category || !_category.length) {
         ep.emit('category', []);
         return false;
      };
      ep.emit('category', _category || []);
    })
  }

// 专业镇参观申请
exports.industrialApply = function(req, res) {
  var iwId = req.params.id;
  var path = req.path;
  //base
  Cluster.find({iwId:iwId,clusterType:1}, function(err, industrial) {
    if (err) {
      console.log(err);
    };
    if (!industrial || !industrial.length) {
      industrial = {logo:''};
    };
    res.render('industrial/industrial-apply', {
      base: industrial,
      path: path,
      logo: industrial.logo,
      iwId:iwId,
      clusterType:1
    })
  });
}

// 专业镇发表评论
exports.industrialPublish = function(req, res) {
  console.log(123);
  var iwId = req.params.id;
  var path = req.path;
  //base
  Cluster.find({iwId:iwId,clusterType:1}, function(err, industrial) {
    if (err) {
      console.log(err);
    };
    if (!industrial || !industrial.length) {
      industrial = {logo:''};
    };
    res.render('industrial/industrial-publish', {
      base: industrial,
      path: path,
      iwId: iwId,
      logo: industrial.logo,
      clusterType:1
    })
  });
}

// 专业镇活动
exports.industrialActivity = function(req, res) {
  var iwId = req.params.id; 
  var path = req.path;
  var ep = new eventproxy;
  ep.all('base','banner1','banner2','banner3',function(base,banner1,banner2,banner3){
    res.type('html');
    res.render('industrial/industrial-activity',{
      title:'专业镇活动',
      iwId:iwId,
      path:path,
      base:base,
      banner1:banner1,
      banner2:banner2,
      banner3:banner3,
      clusterType:1
    })
  });
  //活动 
  IndustrialActivityAct.find({'iwId':iwId})
    .limit(4)
    .sort('sortId')
    .exec(function(err,activityact){
      if (err) {
        console.log(err);
        return;
      };
      if (!activityact || !activityact.length) {
        Cluster.find({'iwId':iwId,clusterType:1})
        .sort('sortId')
        .exec(function(err,industrial){
          if (err) {
            console.log(err);
            return;
          };
          if (!industrial || !industrial.length) {
            ep.emit('base',[{logo:'',allNull:true}]);
          }else{
            ep.emit('base',[{logo:industrial[0].logo,allNull:true}]);
          };
        })
        return false;
      };
      Cluster.find({'iwId':iwId,clusterType:1})
        .sort('sortId')
        .exec(function(err,industrial){
          if (err) {
            console.log(err);
            return;
          };
          if (!industrial || !industrial.length) {
            activityact[0].logo = '';
          }else{
            activityact[0].logo = industrial[0].logo;
          };
          activityact[0].allNull = false;
          ep.emit('base',activityact);
        })
      
    })

  // banner
  IndustrialActivityBanner.find({'iwId':iwId,'place':1})
    .sort('sortId')
    .limit(5)
    .exec(function(err,banner1){
      if (err) {
        console.log(err);
        return;
      };
      if (!banner1 || !banner1.length) {
        ep.emit('banner1',[]);
        return false;
      };
      ep.emit('banner1',banner1);
    })
  IndustrialActivityBanner.find({'iwId':iwId,'place':2})
    .limit(1)
    .exec(function(err,banner2){
      if (err) {
        console.log(err);
        return;
      };
      if (!banner2 || !banner2.length) {
        ep.emit('banner2',[{img:'',link:''}]);
        return false;
      };
      ep.emit('banner2',banner2);
    })
  IndustrialActivityBanner.find({'iwId':iwId,'place':3})
    .limit(1)
    .exec(function(err,banner3){
      if (err) {
        console.log(err);
        return;
      };
      if (!banner3 || !banner3.length) {
        ep.emit('banner3',[{img:'',link:''}]);
        return false;
      };
      ep.emit('banner3',banner3);
    })
}

// 专业镇活动详情
exports.industrialActivityDetail = function(req, res) {

  var iwId = req.params.id;
  var actId = req.params.cateId;
  var path = req.path;
  var ep = new eventproxy();
  //base

  ep.all('base','aact',function(base,aact){
    res.type('.html')
    res.render('industrial/industrial-activity-detail',{
      base: base,
      path: path,
      iwId:iwId,
      actId:actId,
      aact:aact,
      clusterType:1
    })
  })

  Cluster.find({iwId:iwId,clusterType:1}, function(err, industrial) {
    if (err) {console.log(err);};
    if (!industrial || industrial.length==0) {
      var industrial = [{nameEn:'',avatarImage:'',logo:''}]; 
    };
    console.log(industrial);
    ep.emit('base',industrial);
  });
  var search = {iwId:iwId,isRecommend:1};
  IndustrialAllActivitys.find(search)
    .sort('sortId')
    .exec(function(err,resaact){
      if (err) {console.log(err);};
      if (!resaact || resaact.length==0) {
        var resaact = [];
      };
      ep.emit('aact',resaact);
    })
}


//专业镇 列表页
// exports.industrial = function(req, res) {
//   var old = +new Date();
//   var ep = new eventproxy();
//   ep.all('cate', 'silde','categorys',function(cate,silde,categorys){
//     res.type('.html');
//     res.render('industrial-list',{
//       title:'首页',
//       keywords: '专业市场',
//       cate:cate,
//       silde:silde,
//       base:[],
//       categorys:categorys,
//       clusterType:1
//     })
//   });
//   // 类目
//    category(function(ress){
//     console.log(ress);
//     ep.emit('categorys', ress || []);
//   });
//   IndustrialIndexCate.find({state:1})
//     .sort('sortId')
//     .limit(6)
//     .exec(function(err,res){
//       if (err) {
//         console.log(err);
//         return;
//       };
//       ep.emit('cate',res || []);
//     })
//   //主banner
//   Ads.find({'area':3,'ishidden':1})
//     .sort('sortid')
//     .limit(5)
//     .exec(function(err, resAds) {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       ep.emit('silde', resAds || []);
//     })
// }

//具体专业镇首页
exports.industrialContent = function(req, res) {
  var ep = new eventproxy();
  var id = req.params.id;
  var path = req.path;
  var result = res;
  console.log(id);
  ep.all('base', 'menu','slide','topBrands','townAct','markets','comment','adPic',
    function(base,menu, slide,topBrands,townAct,markets,comment,adPic) {
      res.type('.html');
      res.render('industrial/industrial-index', {
        base: base,
        menus: menu,
        slide: slide,
        topBrands: topBrands,
        townAct: townAct,
        markets:markets,
        comment:comment,
        path: path,
        adPic:adPic,
        iwId:id,
        clusterType:1
      })
  })
  //base
  Cluster.find({iwId: id,clusterType:1}, function(err, industrial) {
    if (err) {console.log(err); return;};
    var _industrial = JSON.parse(JSON.stringify(industrial));
    var _relativesArr = _industrial[0].relateIds.split("|");
    Cluster.find({iwId:{$in:_relativesArr}},function(err,relateCluster){
       if (err) {console.log(err);return;}
        _industrial[0].relateIds = relateCluster.splice(0,3);
        if (!_industrial || _industrial.length==0) {
            ep.emit('base',[{nameEn:'',avatarImage:'',relateIds:[]}]);
        }else{
            ep.emit('base',_industrial);
        };
    });
  });

  IndustrialTownMenu.find({iwId: id})
    .limit(11)
    .sort('sortId')
    .exec(function(err, res) {
      if (err) {
        console.log(err)
      };
      ep.emit('menu', res || []);
    })


  IndustrialTops.find({iwId: id})
    .sort('sortId')
    .exec(function(err, res) {
      if (err) {
        console.log(err)
      };
      ep.emit('topBrands', res || []);
    })
  //幻灯片
  IndustrialTownBanner.find({iwId: id,place:1})
    .sort('sortId')
    .limit(5)
    .exec(function(err, res) {
      if (err) {
        console.log(err);
        return;
      };
      ep.emit('slide', res || []);
    })
  // 产业集群入驻宣传图
  IndustrialTownBanner.find({iwId:id,place:2})
    .sort('sortId')
    .limit(1)
    .exec(function(err,res){
      if (err) {
        console.log(err);
        return;
      };
      if (!res || !res.length) {
        ep.emit('adPic',[{link:'',img:''}]);
      };
      ep.emit('adPic',res);
    })

  IndustrialTownAct.find({iwId: id})
    .sort('sortId')
    .limit(7)
    .exec(function(err, res) {
      if (err) {
        console.log(err);
        return false;
      };
      ep.emit('townAct', res || []);
    })


    Cluster.find({iwId: id,isTop:1,clusterType:2})
    .limit(3)
    .sort('sortId')
    .exec(function(err, indstrialMarket) {
      if (err) {
        console.log(err);
        return;
      }
      if (!indstrialMarket || !indstrialMarket.length) {
        ep.emit('markets', []);
        return false;
      };
      ep.emit('markets', indstrialMarket);
    })

    IndustrialTownFB.find({iwId: id})
    .sort('sortId')
    .limit(2)
    .exec(function(err, industrialTownFB) {
      if (err) {
        console.log(err);
        return;
      };
      if (!industrialTownFB || !industrialTownFB.length) {
         ep.emit('comment', []);
      };
      ep.emit('comment', industrialTownFB);
    })
}
// 商城
exports.industrialShop = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  //base
  Cluster.findById(id, function(err, industrial) {
    if (err) {
      console.log(err);
    }
    res.render('industrial-shop', {
      base: industrial,
      path: path,
      logo: industrial.logo
    })
  });
}
// 物流
exports.industrialLogistics = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  //base
  Cluster.findById(id, function(err, industrial) {
    if (err) {
      console.log(err);
    }
    res.render('industrial-logistics', {
      base: industrial,
      path: path,
      logo: industrial.logo
    })
  });
}
//专业镇简介
exports.industrialIntroduce = function(req, res) {
  var iwId = req.params.id;
  var path = req.path;
  var ep = new eventproxy();
  ep.all('base',function(base){
    res.type('.html');
    res.render('industrial/industrial-introduce', {
      base: base,
      path: path,
      content: base.content,
      iwId:iwId,
      logo: base.logo,
      clusterType:1
    })
  })
  Cluster.find({iwId:iwId,clusterType:1}, function(err, industrial) {
    if (err) {console.log(err);};
    if (!industrial || industrial.length==0) {
      var industrial = [{nameEn:'',avatarImage:''}]; 
    };
    ep.emit('base',industrial);
  });
}
//电商园
exports.industrialElectric = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  Cluster.findById(id, function(err, industrial) {
    if (err) {
      console.log(err);
    }
    res.render('industrial-electric', {
      base: industrial,
      path: path,
      logo: industrial.logo
    })
  });
}
//展贸中心
exports.industrialExhibition = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  Cluster.findById(id, function(err, industrial) {
    if (err) {
      console.log(err);
    }
    var content = industrial.exhibition;
    if (content) {
      var marked = require('marked');
      content = marked(content);
    } else {
      res.redirect('/industrial/' + id)
    }
    res.render('industrial-exhibition', {
      base: industrial,
      content: content,
      path: path,
      logo: industrial.logo
    })
  });
}

//专业市场
exports.market = function(req, res) {
  var iwId = req.params.id || '';
  var ep = new eventproxy();

  ep.all('categorys', 'slides', 'markets', function(categorys, slides, markets) {
    res.type('.html')
    res.render('industrial/market-list', {
      categorys: categorys,
      slides: slides,
      markets: markets,
      iwId:iwId,
      clusterType:2
    })
  });

  //类目
  category(function(res){
    ep.emit('categorys', res)
  });

  //slides
  Ads.find({'ishidden':1, 'area':4})
    .sort('sortid')
    .limit(4)
    .exec(function(err, resAds) {
      if (err) {
        console.log(err);
        return;
      }
      ep.emit('slides', resAds);
    })

  //markets;
  //分开查询
  MarketFloor.find({ishidden:1})
    .sort('sortId')
    .exec(function(err, resFloor) {
      if(!resFloor.length) {
        return ep.emit('markets', [])
      }
      resFloor = JSON.parse(JSON.stringify(resFloor));
      var count = 0
      resFloor.forEach(function(item, i){
        Cluster.find({ishidden:1, floorId: item._id,clusterType:2})
          .sort('sortId')
          .exec(function(err, resMarket){
            resFloor[i].items = resMarket;
            count++;
            _res()
          })
      })
      function _res() {
        if (count == resFloor.length) {
          ep.emit('markets', resFloor);
        }
      }
    })
}

exports.marketContent = function(req, res) {
  var ep = new eventproxy();
  var iwId = req.params.id;
  console.log(iwId);
  var path = req.path;
  ep.all("base","banner","entry",'recommends','recommendProduct',"hotProduct","bestProduct","indexActive","feedback","category",
    function(base,banner,entry,recommends,recommendProduct,hotProduct,bestProduct,indexActive,feedback,category) {
      res.type('.html');
      res.render('industrial/market-index', {
        base: base,
        banner: banner,
        entry:entry,
        recommends: recommends,
        recommendProduct: recommendProduct,
        hotProduct: hotProduct,
        bestProduct: bestProduct,
        indexActive: indexActive,
        feedback:feedback,
        category: category,
        path: path,
        iwId:iwId,
        clusterType:2
      })
    }
  );
  Cluster.find({iwId:iwId,clusterType:2}, function(err, _market) {
      if (err) {console.log(err);};
      if (!_market || !_market.length) {
        ep.emit('base',[{img:'',link:'',logo:'',}]);
        return;
      };
      console.log(_market);
      ep.emit('base', _market || []);
    })

  // //专业市场首页banner
  MarketBanner.find({iwId:iwId,place:0})
    .limit(5)
    .sort('sortId')
    .exec(function(err, banner) {
      if (err) {
        console.log(err)
      };
      console.log(banner);
      ep.emit('banner', banner || []);
    })
   MarketBanner.find({iwId:iwId,place:1})
   .limit(1)
   .sort('sortId')
   .exec(function(err, entry1) {
      if (err) {
        console.log(err)
      };
      if (!entry1 || !entry1.length) {
        ep.emit('entry',[{img:'',link:''}]);
        return false;
      };
      ep.emit('entry', entry1);
    })

  // //专业市场recommendations
  MarketRecommendation.find({iwId:iwId})
    .limit(2)
    .sort('sortId')
    .exec(function(err, recommend) {
      if (err) {
        console.log(err)
      };
      ep.emit('recommends', recommend || []);
    })


    MarketRecommendation.find({iwId:iwId})
    .limit(2)
    .sort('sortId')
    .exec(function(err, recommend) {
      if (err) {
        console.log(err)
      };
      if (!recommend || !recommend.length) {
        ep.emit('recommendProduct', [{products:[]}]);
        return false;
      };
      var a = 0;
      var _recommend = JSON.parse(JSON.stringify(recommend));
      _recommend.forEach(function(value,index){
        MarketRecommendProduct.find({iwId:iwId,shopId:value.shopId})
        .limit(6)
        .sort("sortId")
       .exec(function(err, product){
        a++;
        _recommend[index].products = product;
        if (a == _recommend.length ) {
          console.log(_recommend);
          ep.emit('recommendProduct', _recommend);
        }
      });
      })
    })
      // //专业市场hotproduct
    
    MarketHot.find({iwId:iwId})
    .limit(3)
    .sort('sortId')
    .exec(function(err, hot) {
      if (err) {
      
      };
      if (!hot || !hot.length) {
        ep.emit('hotProduct', [{products:[]}]);

        return false;
      };

    var _hot = JSON.parse(JSON.stringify(hot));
    var a = 0;  
      _hot.forEach(function(value, index){
        MarketHotProduct.find({iwId:iwId,shopId:value.shopId})
        .limit(4)
        .sort("sortId")
        .exec(function(err, product){
        a++;
        _hot[index].products = product;
        if (a == _hot.length ) {
          console.log(_hot)
          ep.emit('hotProduct', _hot)
        }
      });
      })
    })


     // //专业市场bestSeller
    
    MarketBest.find({iwId:iwId})
    .limit(5)
    .sort('sortId')
    .exec(function(err, best) {
      if (err) {
        console.log(err)
      };
      if (!best || !best.length) {
        ep.emit('bestProduct', [{products:[]}]);
        return false;
      };
      var _best = JSON.parse(JSON.stringify(best));
      var a = 0;  
      _best.forEach(function(value, index){
      MarketBestProduct.find({iwId:iwId,shopId:value.shopId})
        .limit(3)
        .sort("sortId")
       .exec(function(err, product){
        a++;
        _best[index].products = product;
        if (a == _best.length ) {
          console.log(_best)
          ep.emit('bestProduct', _best);
        }
      });
      })
    })
    // 专业市场首页的活动
    MarketIndexActive.find({iwId:iwId})
    .limit(3)
    .sort('sortId')
    .exec(function(err, indexActive) {
      if (err) {
        console.log(err)
      };
      ep.emit('indexActive', indexActive || []);
    })

    // 反馈
     MarketFeedback.find({iwId:iwId})
     .limit(2)
    .sort('sortId')
    .exec(function(err, feedback) {
      if (err) {
        console.log(err)
      };
      ep.emit('feedback', feedback || []);
    })
    // 类目
    MarketCate.find({iwId:iwId})
    .limit(6)
    .sort('sortId')
    .exec(function(err, _category) {
      if (err) {
        console.log(err)
      };
      ep.emit('category', _category || []);
    })
}

// 专业市场活动列表页

exports.marketActive = function(req, res) {
  var ep = new eventproxy();
  var iwId = req.params.id;
  var path = req.path;
  ep.all("base","banner","upBanner","bottomBanner","recommends",
    function(base,banner,upBanner,bottomBanner,recommends) {
      res.type('.html');
      res.render('industrial/market-activity', {
        base: base,
        banner:banner,
        upBanner:upBanner,
        iwId:iwId,
        bottomBanner:bottomBanner,
        recommends:recommends,
        path: path,
        clusterType:2
      })
    }
  );
    Cluster.find({iwId:iwId,clusterType:2}, function(err, _market) {
      if (err) console.log(err);
      var market = JSON.parse(JSON.stringify(_market));
      console.log(market)
      ep.emit('base', market)
    })
   MarketActiveBanner.find({iwId:iwId,place:0}, function(err, banner) {
      if (err) {
        console.log(err);
      }
       if (banner && banner.length) {
        banner = banner.slice(0, 5)
      }
      ep.emit('banner', banner || []);
    })

    MarketActiveBanner.find({iwId:iwId,place:1}, function(err, _upBanner) {
      if (err) {
        console.log(err);
      }
       var upBanner = JSON.parse(JSON.stringify(_upBanner));
      ep.emit('upBanner', upBanner || []);
    })
     MarketActiveBanner.find({iwId:iwId,place:2}, function(err, _bottomBanner) {
      if (err) {
        console.log(err);
      }
      var bottomBanner = JSON.parse(JSON.stringify(_bottomBanner));
      ep.emit('bottomBanner', bottomBanner || []);
    })



      MarketActive.find({iwId:iwId})
    .sort('sortId')
    .exec(function(err, _recommend) {
      if (err) {
        console.log(err)
      }
      console.log(_recommend);
     
      if (_recommend && _recommend.length) {
       var  recommend = _recommend.slice(0, 4)
      }
      ep.emit('recommends', recommend || []);
    })


}
// 专业市场评论列表页
exports.marketCommentList = function(req, res) {
  var ep = new eventproxy();
  var iwId = req.params.id;
  var path = req.path;


  ep.all("base",
    function(base) {
      res.type('.html');
      res.render('industrial/market-comment-list', {
        base: base,
        iwId: iwId,
        path: path,
        clusterType:2
      })
    }
  );
    Cluster.find({iwId:iwId,clusterType:2}, function(err,market) {
      if (err) {
        console.log(err);
      }
      ep.emit('base', market)
    })
   
}
// 专业市场评论发表页
exports.marketComment = function(req, res) {
  var ep = new eventproxy();
  var iwId = req.params.id;
  var path = req.path;
  ep.all("base",
    function(base) {
      res.type('.html');
      res.render('industrial/market-comment', {
        base: base,
        iwId: iwId,
        path: path,
        clusterType:2
      })
    }
  );
    Cluster.find({iwId:iwId,clusterType:2}, function(err,market) {
      if (err) {
        console.log(err);
      }
    
      console.log(market)
      ep.emit('base', market)
    })
   
}

// 专业市场评论详情页
exports.marketCommentDetial = function(req, res) {
  var ep = new eventproxy();
  var iwId = req.params.id;
  var detailId = req.params.detailId;
  var path = req.path;
  ep.all("base",
    function(base) {
      res.type('.html');
      res.render('industrial/market-comment-detail', {
        base: base,
        iwId: iwId,
        detailId:detailId,
        path: path,
        clusterType:2
      })
    }
  );
  
    Cluster.find({iwId:iwId,clusterType:2}, function(err,market) {
      if (err) {
        console.log(err);
      };
      ep.emit('base', market)
    })
   
}
// 专业市场简介
exports.marketIntroduce = function(req, res) {
  var ep = new eventproxy();
  var iwId = req.params.id;
  var path = req.path;

  ep.all("base",
    function(base) {
      res.type('.html');
      res.render('industrial/market-introduce', {
        base: base,
        path: path,
        iwId:iwId,
        clusterType:2
      })
    }
  );
  
    Cluster.find({iwId:iwId,clusterType:2}, function(err,market) {
      if (err) {
        console.log(err);
      };
      if (!market || market.length==0) {
        ep.emit('base', [{avatarImage:''}]);
        return false;
      };
      ep.emit('base', market)
    })
   
}
exports.marketProducts = function(req,res){
  var ep = new eventproxy();
  var iwId = req.params.id;
  var cateId = req.params.cateId;
  var path = req.path;
  var _type = req.query.type || null;
  ep.all("base","category",
    function(base,category) {
      res.type('.html');
      res.render('industrial/market-products', {
        base: base,
        iwId:iwId,
        cateId:cateId,
        category: category,
        path: path,
        clusterType:2,
          type:_type
      })
    }
  );
  
    Cluster.find({iwId:iwId,clusterType:2}, function(err,market) {
      if (err) {
        console.log(err);
      }
      ep.emit('base', market)
    })
    // 类目
     MarketCate.find({iwId:iwId})
    .sort('sortId')
    .exec(function(err, _category) {
      if (err) {
        console.log(err)
      }
        if (_category && _category.length) {
        var category = _category.slice(0,6)
      }
      ep.emit('category', category || []);
    })
}

// 专业市场参观访问申请
exports.marketApply = function(req, res) {
  var ep = new eventproxy();
  var iwId = req.params.id;
  var path = req.path;


  ep.all("base",
    function(base) {
      res.type('.html');
      res.render('industrial/market-apply', {
        base: base,
        path: path,
        iwId:iwId,
        clusterType:2
      })
    }
  );
  
    Cluster.find({iwId:iwId,clusterType:2}, function(err,market) {
      if (err) {
        console.log(err);
      };
      ep.emit('base', market)
    })
   
}



// 专业市场活动详情
exports.marketActiveDetail = function(req, res) {
  var ep = new eventproxy();
  var iwId = req.params.id || '';
  var activeId = req.params._id;
  var path = req.path;

  ep.all("base","aact",function(base,aact) {
      res.type('.html');
      res.render('industrial/market-activity-detail', {
        iwId:iwId,
        base:base,
        activeId:activeId,
        aact:aact,
        path: path,
        clusterType:2
      })
    }
  );

  Cluster.find({iwId:iwId,clusterType:2}, function(err,_market) {
      if (err) console.log(err);
      var market = JSON.parse(JSON.stringify(_market));
      ep.emit('base', market)
    });
  var search = {iwId:iwId,isRecommend:1};
  MarketAllActivitys.find(search)
    .sort('sortId')
    .exec(function(err,resaact){
      if (err) {console.log(err);};
      if (!resaact || resaact.length==0) {
        var resaact = [];
      };
      ep.emit('aact',resaact);
    })

}
// 商城
exports.marketShop = function(req, res) {
  var iwId = req.params.id || '';
  var path = req.path;
  var ep = new eventproxy();

  ep.all('base', 'menus', function(base, menus) {
    res.render('market-shop', {
      base: base,
      menus: menus,
      path: path,
      logo: base.logo,
      iwId:iwId,
      clusterType:2
    })
  })
  //base
  Cluster.findById(iwId, function(err, market) {
    if (err) {
      console.log(err);
    }
    ep.emit('base', market);
  });
  MarketMenu.find({iwId: iwId, ishidden:1})
    .sort('sortId')
    .exec(function(err, res) {
      if (err) {
        console.log(err)
      }
      var menu = toTreeData(res, id);
      if(menu && menu.length) {
        menu = menu.slice(0, 5);
      }
      ep.emit('menus', menu || []);
    })
}
// 物流
exports.marketLogistics = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  //base
  Cluster.findById(id, function(err, market) {
    if (err) {
      console.log(err);
    }
    res.render('market-logistics', {
      base: market,
      path: path,
      logo: market.logo
    })
  });
}

//电商园
exports.marketElectric = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  Cluster.findById(id, function(err, market) {
    if (err) {
      console.log(err);
    }
    res.render('market-electric', {
      base: market,
      path: path,
      logo: market.logo
    })
  });
}
//展贸中心
exports.marketExhibition = function(req, res) {
  var iwId = req.params.id;
  var path = req.path;
  var ep = new eventproxy();
  ep.all('base', 'menus', function(base, menus) {
    res.render('market-exhibition', {
      base: base,
      menus: menus,
      path: path,
      logo: base.logo
    })
  })
  Cluster.findById(iwId, function(err, market) {
    if (err) {
      console.log(err);
    }
    ep.emit('base', market)
  });
  MarketMenu.find({iwId: iwId, ishidden:1})
    .sort('sortId')
    .exec(function(err, res) {
      if (err) {
        console.log(err)
      }
      var menu = toTreeData(res, iwId);
      if (menu && menu.length) {
        menu = menu.slice(0, 5)
      }
      ep.emit('menus', menu || []);
    })
}


//新闻中心
exports.industrialNewList = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  var ep = new eventproxy();
  ep.all('base',function(base) {
    res.render('industrial-news', {
      base: base,
      actList: actList,
      news: news,
      path: path,
      logo: base.logo
    })
  })


    Cluster.findById(id, function(err, Industrial) {
    if (err) {
      console.log(err);
    }
    ep.emit('base', Industrial)
  });
}

//获取文章详情
exports.getNewsContent = function(req, res) {
  var id = req.params.id;
  var newsId = req.params.newsId;
  var path = req.path;
 var ep = new eventproxy();
   var search={
    industrialId:id,
    _id:newsId

   }

  ep.all('base', function(base) {
    res.render('industrial-newsDetails', {
      base: base,
     
      news: newsDetails,
      path: path,
      logo: base.logo||null
    })
  })
   Cluster.findById(id, function(err, Industrial) {
    if (err) {
      console.log(err);
    }
    ep.emit('base', Industrial)
  });

}


//促销页面

exports.getSpecialContent = function(req, res) {
  var id = req.params.id;
  var newsId = req.params.newsId;
  var path = req.path;
  var dataTime =new Date().getTime();
  var ep = new eventproxy();

  ep.all('specialBanner', 'specialCate','specialProduct',function(specialBanner, specialCate,specialProduct) {
    res.render('special', {
      logoText:"Special Offers",
      specialBanner: specialBanner,
      specialCate: specialCate,
      specialProduct: specialProduct,
      path: path
    })
  })

SpecialBanner.find({'ishidden':1})
  .sort('sortId')
  .exec(function(err, specialBanner) {
    if (err) {
      console.log(err);
    }
    
    ep.emit('specialBanner', specialBanner || [])
  });


  SpecialCate.find({})
   .sort('sortId')
   .limit(6)
  .exec(function(err, specialCate) {
    if (err) {
      console.log(err);
    }
 
    ep.emit('specialCate', specialCate || []);
  });

  SpecialCate.find({})
  .sort('sortId')
  .exec(function(err, specialCate) {

    var resProduct=JSON.parse(JSON.stringify(specialCate));
    var a = 0;
    var newArr = [];
    if(!resProduct || !resProduct.length) {
        ep.emit('specialProduct', [])
      }
    resProduct.forEach(function(value, index){
        //产品
        
        newArr = [];
        console.log( newArr)
        SpecialProduct.find({'isTop':1,'cateId': value._id})
          .sort('sortId')
          .exec(function(err, product){
            console.log(product)
            a++
            if (err) {
              console.log(err);
            }

            for(var i =0;i<product.length;i++){
            
              var nowTime = Number(dataTime)
              var time = Date.parse(new Date(product[i].endTime))
             
              if(nowTime -time <= 0 ){
                 newArr.push(product[i])
              }
            
               
            }
           
            value.products = newArr;
            newArr = [];
            if (a == resProduct.length ) {
             
               console.log(resProduct);
              ep.emit('specialProduct', resProduct)
            }
          });
      });
  });
};
exports.getFastShipIndexContent = function(req,res) {
  var path = req.path;
  var ep = new eventproxy();
  ep.all('base','stair','moduls','floor','ads',function(base,stair,moduls,floor,ads){
    res.render('fastship/fastship-index',{
      base:base,
      stair:stair,
      moduls:moduls,
      floor:floor,
      ads:ads,
      path:path,
      logoText:'Fast Shipping'
    });
  });
  ep.emit('base', [{logo:''}]);
    //广告
  Ads.find({'ishidden':1, 'area':2})
    .sort('sortid')
    .limit(5)
    .exec(function(err, resAds){
      if (err) {
        console.log(err);
      }
      console.log(resAds);
      ep.emit('ads', resAds);
    });

  FastShipFirstStair.find({'state':1})
    .sort('sortId')
    .exec(function(err,firststair){
      if (err) {
        console.log(err);
      };
       if(!firststair || firststair.length==0) {
            ep.emit('stair', [{secArr:[{thrArr:[]}]}]);
            return false;
         };
      var _firststair = JSON.parse(JSON.stringify(firststair));
      var a = 0;
      _firststair.forEach(function(item,i){
        FastShipSecStair.find({'parentId':item._id,'state':1})
          .sort('sortId')
          .exec(function(err,secstair){
            if (err) {
              console.log(err);
            };
            a++;
            var _secstair = JSON.parse(JSON.stringify(secstair));
            if (!_secstair || _secstair.length==0) {
              _firststair[i].secArr = [];
            }else{
              _firststair[i].secArr = _secstair;
            };
            var count = 0;
            _secstair.forEach(function(childitem,j){
              FastShipThrStair.find({'parentId':childitem._id,'state':1})
                .sort('sortId')
                .exec(function(err,thrstair){
                  if (!thrstair || thrstair.length==0) {
                    childitem.thrArr = false;
                  }else{
                    childitem.thrArr = thrstair;
                  };
                  count++;
                  if (a == _firststair.length && count == _secstair.length) {
                    setTimeout(function() { 
                      ep.emit('stair',_firststair);
                    }, 500); 
                  };
                 
                })
            });
          });
      });
      
});

  FastShipIndexModule.find({'state':1})
    .sort('sortId')
    .exec(function(err,modules){
      if (err) {
        console.log(err);
      };
      if (!modules || !modules.length) {
         ep.emit('moduls',[{modules:[]}]);
         return false;
      };
      ep.emit('moduls',modules);
    });
  FastShipIndexFloor.find({'state':1})
    .sort('sortId')
    .exec(function(err,floors){
      if (err) {
        console.log(err);
      };

        if(!floors || !floors.length) {
            ep.emit('floor', [{proArr:[],cateArr:[]}]);
            return false;
         }

      var _floors = JSON.parse(JSON.stringify(floors));
      var count = 0;
      _floors.forEach(function(item,i){
        FastShipIndexFloorPro.find({'floorId':item._id})
          .sort('sortId')
          .exec(function(err,floorpro){
            if (err) {
              console.log(err);
            };
            FastShipIndexFloorCate.find({'floorId':item._id})
              .sort('sortId')
              .exec(function(err,floorcate){
                if (err) {
                  console.log(err);
                };
                _floors[i].proArr = floorpro;
                _floors[i].cateArr = floorcate;
                count++;
                if (count == _floors.length) {
                  ep.emit('floor',_floors);
                };
              });
          });
      });
    });
};
exports.getFastShipChennalContent = function(req,res) {
    var chennalType = req.params.type;
    var path = req.path;
    var perPage = 20;
    var ep = new eventproxy();
    var title;
   
    ep.all('chennalContent','moduls','ads',function(chennalContent,moduls,ads){
      res.render('fastship/fastship-chennal',{
        base:chennalContent,
        path:path,
        moduls:moduls,
        ads:ads,
        title:title,
        type:chennalType,
        logoText:'Fast shipping',

      });
    });


 if (chennalType == '1') {
      title = 'Hot Selling';
     Ads.find({'ishidden':1, 'area':5})
    .sort('sortid')
    .limit(1)
    .exec(function(err, resAds){
      if (err) {
        console.log(err);
      }
      ep.emit('ads', resAds);
    });
    }else if (chennalType == '2') {
      title = 'Lowest Price';
    Ads.find({'ishidden':1, 'area':6})
    .sort('sortid')
    .limit(1)
    .exec(function(err, resAds){
      if (err) {
        console.log(err);
      }
      ep.emit('ads', resAds);
    });

    }else if (chennalType == '3') {
      title = 'Sample';
      Ads.find({'ishidden':1, 'area':7})
    .sort('sortid')
    .limit(1)
    .exec(function(err, resAds){
      if (err) {
        console.log(err);
      }
      ep.emit('ads', resAds);
    });
    };

    FastShipChennalCate.find({'type':chennalType,'state':1})
      .sort('sortId')
      .exec(function(err,chennalcate){
        if (err) {
          console.log(err);
        };


        if(!chennalcate || !chennalcate.length) {
            ep.emit('chennalContent', [{proArr:[]}]);
            return false;
            }

        var _chennalcate = JSON.parse(JSON.stringify(chennalcate));//
        console.log(_chennalcate);

           
          FastShipProduct.find({'parentId':_chennalcate[0]._id,state:"1"})
          .limit(perPage)
          .sort('sortId')
          .exec(function(err,chennalpro){
            if (err) {
              console.log(err);
            };
             _chennalcate[0].proArr = chennalpro;
            FastShipProduct.find({'parentId':_chennalcate[0]._id}).count(function(err,count){
              if (err) {
                console.log(err);
              };
              _chennalcate[0].maxPage =Math.ceil(count/perPage);
              ep.emit('chennalContent',_chennalcate);
            });
          });
       
      
      });
    FastShipIndexModule.find({'state':1})
    .sort('sortId')
    .exec(function(err,modules){
      if (err) {
        console.log(err);
      };
      ep.emit('moduls',modules);
    });
};



// 创新设计

exports.innovativeContent = function(req, res) {
  var path = req.path;
  var ep = new eventproxy();
  ep.all('innovativeBanner', 'innovative','innovativeProduct',function(innovativeBanner, innovative,innovativeProduct) {
    res.render('innovative', {
      innovativeBanner: innovativeBanner,
      innovative: innovative,
      innovativeProduct: innovativeProduct,
      path: path,
      logoText:'Innovation & Design',
    })
  })

  InnovativeBanner.find({})
  .sort('sortId')
  .exec(function(err, _innovativeBanner) {
    if (err) {
      console.log(err);
    }

    if (!_innovativeBanner || !_innovativeBanner.length) {
        ep.emit('innovativeBanner', []);
        return false;
      };

    console.log(_innovativeBanner);
     var innovativeBanner =  null;
    if(_innovativeBanner.length<=4){
      innovativeBanner = _innovativeBanner
    }else{
      innovativeBanner = _innovativeBanner.slice(0,4)
    }
    console.log(innovativeBanner);
    ep.emit('innovativeBanner', innovativeBanner || [])
  });



  Innovative.find({ishidden:1})
  .sort('sortId')
  .exec(function(err, _innovative){
      if (err) console.log(err);
     var innovative = _innovative.splice(0,6);
     console.log(innovative);
      ep.emit('innovative', innovative)
    });
 
 Innovative.find({ishidden:1})
  .sort('sortId')
  .exec(function(err, _innovative){
      if (err) console.log(err);
      if (!_innovative || !_innovative.length) {
        ep.emit('innovativeProduct', []);
        return false;
      };

     var innovative = _innovative.splice(0,6);
      var a = 0;
     console.log(innovative);
     innovative.forEach(function(value,index){
        InnovativeProduct.find({cateName:value.nameEn})
        .sort('sortId')
        .exec(function(err, _product){
            a++
            if (err) {
              console.log(err);
            }
             var product = _product.splice(0,8)
            innovative[index].products = product;
            if (a == innovative.length ) {
               console.log(innovative);
              ep.emit('innovativeProduct', innovative)
            }
          });

     })
    });
}
// learn more
exports.inspectionService = function(req,res){
  var path = req.path;
  var ep = new eventproxy();
  
  ep.all('categorys',function(categorys){
    var renderObj = {
      categorys:categorys
    };
    res.type('html');
    res.render('inspection',renderObj);
  });
  
  //类目
  category(function(ress){
    console.log(ress);
    ep.emit('categorys', ress || []);
  });

}
exports.businessMatch = function(req,res){
  var path = req.path;
  var ep = new eventproxy();
  ep.all('categorys',function(categorys){
    var renderObj = {
      categorys:categorys
    };
    res.type('html');
    res.render('business',renderObj);
  });

  //类目
  category(function(ress){
    console.log(ress);
    ep.emit('categorys', ress || []);
  })

}
exports.escrow = function(req,res){
  var path = req.path;
  var ep = new eventproxy();
  ep.all('categorys',function(categorys){
    var renderObj = {
      categorys:categorys
    };
    res.type('html');
    res.render('escrow',renderObj);
  });
  
  //类目
  category(function(ress){
    ep.emit('categorys', ress || []);
  })

}


exports.reg = function(req,res){
  var path = req.path;
  var ep = new eventproxy();
  ep.all('categorys',function(categorys){
    var renderObj = {
      categorys:categorys
    };
    res.type('html');
    res.render('reg',renderObj);
  });
  
  //类目
  category(function(ress){
    ep.emit('categorys', ress || []);
  })

}


exports.account = function(req,res){
  var path = req.path;
  var ep = new eventproxy();
  ep.all('categorys',function(categorys){
    var renderObj = {
      categorys:categorys
    };
    res.type('html');
    res.render('account',renderObj);
  });
  
  //类目
  category(function(ress){
    ep.emit('categorys', ress || []);
  })

}



exports.zhuanti = function(req,res){
  var path = req.path;
  var ep = new eventproxy();
  ep.all('categorys',function(categorys){
    var renderObj = {
      categorys:categorys
    };
    res.type('html');
    res.render('special/zhuanti_nk',renderObj);
  });
  
  //类目
  category(function(ress){
    ep.emit('categorys', ress || []);
  })

}

exports.downloadApp = function(req,res){
  var path = req.path;
  var ep = new eventproxy();
  ep.all('categorys',function(categorys){
    var renderObj = {
      categorys:categorys,
      base:{},
      clusterType:""
    };
    res.type('html');
    res.render('download-app.html',renderObj);
  });
  
  //类目
  category(function(ress){
    ep.emit('categorys', ress || []);
  })

}

exports.downloadAppSeller = function(req,res){
  var path = req.path;
  var ep = new eventproxy();
  ep.all('categorys',function(categorys){
    var renderObj = {
      categorys:categorys,
      base:{},
      clusterType:""
    };
    res.type('html');
    res.render('download-app-seller.html',renderObj);
  });
  
  //类目
  category(function(ress){
    ep.emit('categorys', ress || []);
  })

}

exports.pcChat = function(req,res){
  
  res.render('chat/chatRobot.html');

}


exports.appChat = function(req,res){
  
  res.render('chat/chatRobotApp.html');

}

//转为树形结构
function category(cb) {
  redis.get('category', function(err, res){
    res = JSON.parse(res);
    if (res && res.length) {
      res = res.slice(0, 12)
    }
    cb(res || []);
  })
}
