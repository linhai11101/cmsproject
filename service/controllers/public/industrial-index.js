// 第三方模块（中间件）
var _ = require('underscore'),
	eventproxy = require('eventproxy');
// 文件模块
var redis = require('../../util/redis'),
	toTreeData = require('../../util/tree').toTreeData,
	// 模型
	Ads = require('../../models/ads'),
	// Industrial = require('../../models/industrial'),
  // Market = require('../../models/market.js'),
  Cluster = require('../../models/cluster'),
	IndustrialIndexCate = require('../../models/industrialIndexCate');

//专业镇 列表页
exports.newIndustrial = function(req, res) {
  var old = +new Date();
  var ep = new eventproxy();
  ep.all('cate', 'silde','categorys',function(cate,silde,categorys){
    res.type('.html');
    res.render('industrial-list',{
      title:'首页',
      keywords: '专业市场',
      cate:cate,
      silde:silde,
      base:[],
      categorys:categorys
    })
  });
  // 类目
   category(function(ress){
    ep.emit('categorys', ress || []);
  });
  IndustrialIndexCate.find({state:1})
    .sort('sortId')
    .limit(6)
    .exec(function(err,res){
      if (err) {
        console.log(err);
        return;
      };
      ep.emit('cate',res || []);
    })
  //主banner
  Ads.find({'area':3,'ishidden':1})
    .sort('sortid')
    .limit(5)
    .exec(function(err, resAds) {
      if (err) {
        console.log(err);
        return;
      }
      ep.emit('silde', resAds || []);
    })
}


// 获取redis的类目
function category(cb){
	redis.get('category',function(err,res){
		res = JSON.parse(res);
		if (res && res.length) {
			res = res.slice(0,12);
		};
		cb(res || []);
	})
}

