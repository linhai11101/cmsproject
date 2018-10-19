var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var superagent = require('superagent');
var config = require('../config');
var User = require('../controllers/user');
//后台
router.get('/cptbtptp', function(req, res) {
  res.type('.html');
  res.render('admin/index', {
    title: 'Expresss',
    path: '/cms/api'
  });
});
//引入控制器
var Public = require('../controllers/public'),
    IndustrialIndex = require('../controllers/public/industrial-index'),
    EZPublic = require('../controllers/public/ezine'),
    ActForecastPublic = require('../controllers/public/activity-forecast'),
    ExhActivePublic = require('../controllers/public/exhibition-active');
//首页
router.get('/', Public.index);
router.get('/index', function(req, res) {
  res.redirect('/');
});
//买家保护
router.get('/protect.html', Public.protect);
//专业镇路由
router.get('/industrial.html',IndustrialIndex.newIndustrial);
router.get('/industrial/:id.html', Public.industrialContent);
router.get('/industrial/comment-list/:id.html',Public.industrialCommentList);
router.get('/industrial/comment-detail/:id/:detailId.html', Public.industrialCommentDetial);
router.get('/industrial/:id/apply.html', Public.industrialApply);
router.get('/industrial/:id/publish.html', Public.industrialPublish);
router.get('/industrial/:id/:cateId/activity-detail.html', Public.industrialActivityDetail);
router.get('/industrial/:id/activity.html', Public.industrialActivity);
router.get('/industrial/:id/:cateId/products.html',Public.industrialProducts);
router.get('/industrial/:id/introduce.html', Public.industrialIntroduce);
router.get('/industrial/:id/logistics.html', Public.industrialLogistics);
router.get('/industrial/:id/electricBusinessPark.html', Public.industrialElectric);
router.get('/industrial/:id/exhibitionTradeCenter.html', Public.industrialExhibition);
router.get('/industrial/:id/news.html', Public.industrialNewList);
router.get('/industrial/:id/news/:newsId.html', Public.getNewsContent);
// 专业市场路由
router.get('/market/:id/index.html', Public.marketContent);
router.get('/market/:id/activity.html', Public.marketActive);
router.get('/market/comment-list/:id.html',Public.marketCommentList);
router.get('/market/comment-detail/:id/:detailId.html', Public.marketCommentDetial);
router.get('/market/comment/:id.html', Public.marketComment);
router.get('/market/:id/introduce.html', Public.marketIntroduce);
router.get('/market/:id/:cateId/products.html',Public.marketProducts);
router.get('/market/:id/apply.html', Public.marketApply);
router.get('/market/activity-detail/:id/:_id.html', Public.marketActiveDetail); 
router.get('/market.html', Public.market);
router.get('/market/:id/onlineShop.html', Public.marketShop);
router.get('/market/:id/logistics.html', Public.marketLogistics);
router.get('/market/:id/electricBusinessPark.html', Public.marketElectric);
router.get('/market/:id/exhibitionTradeCenter.html', Public.marketExhibition);
// 样品
router.get('/sample.html', Public.sample);
//促销页面
router.get('/special.html', Public.getSpecialContent);
// 创新设计首页
router.get('/innovative.html', Public.innovativeContent);
// 快速路由
router.get('/fastshipindex.html',Public.getFastShipIndexContent);
router.get('/fastshipchennal/:type.html',Public.getFastShipChennalContent);
// learn more
router.get('/inspection_service.html',Public.inspectionService);
router.get('/business_match.html',Public.businessMatch);
router.get('/cms/escrow.html',Public.escrow);
//电子杂志路由
router.get('/cms/e-zine.html',EZPublic.ezine);
router.get('/cms/reg.html',Public.reg);
router.get('/cms/account.html',Public.account);
router.get('/cms/special/zhuanti_nk.html',Public.zhuanti);
// 活动预告
router.get('/cms/activity-forecast/:id.html',ActForecastPublic.actForecast);
// 展览活动邀请
router.get('/cms/exhinvite/:flag.html',ExhActivePublic.exhActiveIndex)
// app 下载说明页
router.get('/cms/download-app.html',Public.downloadApp);
router.get('/cms/download-app-seller.html',Public.downloadAppSeller);

// app 下载说明页
router.get('/cms/robotChat/pcChat.html',Public.pcChat);
router.get('/cms/robotChat/chatRobotApp.html',Public.appChat);

//生成页面
router.get('/create/index', function(req, res) {
  var _path = path.join(__dirname, '..', 'views/index.html');
  //var tempale = fs.readFileSync(_path, 'utf-8');
  superagent.get('/index?type=json').end(function (err, sres) {
    sres.body.assetsPath = config.ASSETS_PATH;
    ejs.renderFile(_path, sres.body, function(err, result) {
      if (err) return;
      fs.writeFile('index.html', result, 'utf-8', function(err) {
        if (!err) {
          res.json({'status':1, msg: '成功'})
        } else {
          res.json({'status':0, msg: '失败'})
        }
      })
    });
  })
});
router.get('/create/sample', function(req, res) {
  var _path = path.join(__dirname, '..', 'views/sample.html');
  //var tempale = fs.readFileSync(_path, 'utf-8');
  superagent.get('/sample?type=json').end(function (err, sres) {
    sres.body.assetsPath = config.ASSETS_PATH;
    ejs.renderFile(_path, sres.body, function(err, result) {
      fs.writeFile('sample.html', result, 'utf-8', function(err) {
        if (!err) {
          res.json({'status':1, msg: '成功'})
        } else {
          res.json({'status':0, msg: '失败'})
        }
      })
    });
  })
});

module.exports = router;
