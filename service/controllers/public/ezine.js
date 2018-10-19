var _ = require('underscore');
var eventproxy = require('eventproxy');

var redis = require('../../util/redis');
var toTreeData = require('../../util/tree').toTreeData;

// 模型
var EZcategory = require('../../models/ezine/category'),
    industrialModel = require('../../models/ezine/industrial'),
    componyModel = require('../../models/ezine/compony'),
    recommendModel = require('../../models/ezine/recommend'),
    Ads = require('../../models/ads');




//电子杂志
exports.ezine = function(req,res){
  var path = req.path;
  var ep = new eventproxy();
  ep.all('cate','ezcate','recommend','industrial','compony','ads',
    function(cate,ezcate,recommend,industrial,compony,ads){
    res.type('html');
    res.render('e-zine',{
      categorys:cate,
      ezcate:ezcate,
      recommend:recommend,
      industrial:industrial,
      compony:compony,
       ads:ads
    });
  });

  Ads.find({'ishidden':1, 'area':9})
  .sort('sortid')
  .limit(5)
  .exec(function(err, resAds){
    if (err) {
      console.log(err);
    }
    ep.emit('ads', resAds || []);
  });

  category(function(ress){
    ep.emit('cate',ress || []);
  });
  
  EZcategory
    .find({parentid:0,isCate:true})
    .exec(function(err,ezine){
      if (err) {ep.emit('ezcate',ezine || []);}
      ep.emit('ezcate',ezine || []);
    })
  recommendModel
    .find({isHidden:1,area:11})
    .exec(function(err,resi){
      if (err) {resi=[]}
      recommendModel
        .find({isHidden:1,area:12})
        .exec(function(err,resii){
          if (err) {resii=[]}
          recommendModel
            .find({isHidden:1,area:13})
            .exec(function(err,resiii){
              if (err) {resiii=[]}
              ep.emit('recommend',[].concat(resi,resii,resiii) || []);
            })
        })
      
    });
  industrialModel
    .find({isHidden:1})
    .exec(function(err,res){
      var a = JSON.parse(JSON.stringify(res));
      a = toTreeData(res,0,{img:''});
      var len = a.length;
      a.forEach(function(item,index){
        if (!item.children || item.children.length==0) {
          item.children = [{img:''}]
        };
        if ((len-1) == index) {
          ep.emit('industrial',a);
        }
      });
      if (len==0) {
        ep.emit('industrial',a);
      };
    });
  componyModel
    .find({isHidden:1})
    .exec(function(err,res){
      var a = JSON.parse(JSON.stringify(res));
      a = toTreeData(res,0);
      ep.emit('compony',a);
    });
}


//转为树形结构
function category(cb) {
  redis.get('category', function(err, res){
    res = JSON.parse(res);
    if (res && res.length) {
      res = res.slice(0, 12);
    }
    cb(res || []);
  })
}
function ezcategory(cb){
  redis.get('ezcategory',function(err,res){
    if (err) console.log(err);
    res = JSON.parse(res);
    cb(res || []);
  })
}

