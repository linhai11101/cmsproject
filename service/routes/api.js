/**
 * 广贸基地api
 * @time 2017/01/06
 */
var url = require('url');
var util = require('util');
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');

var express = require('express');
var router = express.Router();

var config = require('../config');

//用户
var User = require('../controllers/user');
router
  .post('/login', User.login)
  .post('/logout', User.logout)
  .get('/users', User.signinRequired, User.adminRequired, User.getList)
  .post('/user', User.signinRequired, User.adminRequired, User.save)
  .delete('/user/:ids', User.signinRequired, User.adminRequired, User.del)

//栏目首页
var IndexFloor = require('../controllers/index');
router
  //楼层
  .get('/indexFloor', User.signinRequired, IndexFloor.get)
  .post('/indexFloor', User.signinRequired, IndexFloor.save)
  .delete('/indexFloor/:id', User.signinRequired, IndexFloor.del)
  //产品
  .get('/indexProduct/:floorid', User.signinRequired, IndexFloor.getProduct)
  .post('/indexProduct', User.signinRequired, IndexFloor.saveProduct)
  .delete('/indexProduct/:id', User.signinRequired, IndexFloor.delProduct)
  //logo
  .get('/indexLogo/:floorid', User.signinRequired, IndexFloor.getLogo)
  .post('/indexLogo', User.signinRequired, IndexFloor.saveLogo)
  .delete('/indexLogo/:id', User.signinRequired, IndexFloor.delLogo)
  //link
  .get('/indexLink/:floorid', User.signinRequired, IndexFloor.getLink)
  .post('/indexLink', User.signinRequired, IndexFloor.saveLink)
  .delete('/indexLink/:id', User.signinRequired, IndexFloor.delLink)


//首页活动
var HomeAct = require('../controllers/index');
router
   .get('/getAllHomeAct', User.signinRequired, HomeAct.getAllHomeAct)
   .post('/saveHomeAct', User.signinRequired, HomeAct.saveHomeAct)
   .delete('/homeAct/:ids', User.signinRequired, HomeAct.delHomeAct)



 //首页快速航运
var HomeFastShipCate = require('../controllers/index');
router
   .get('/getAllHomeFastShipCate', User.signinRequired, HomeFastShipCate.getAllHomeFastShipCate)
   .post('/saveHomeFastShipCate', User.signinRequired, HomeFastShipCate.saveHomeFastShipCate)
   .delete('/homeFastShipCate/:ids', User.signinRequired, HomeFastShipCate.delHomeFastShipCate)  


//类目管理
var Category = require('../controllers/category');
router
  .get('/category', Category.getAll)
  .post('/category/cache', Category.setCache)
  .get('/category/list/:parentid', User.signinRequired, Category.get)
  .get('/category/:id', User.signinRequired, Category.getOne)
  .post('/category', User.signinRequired, Category.save)
  .post('/category/move', User.signinRequired, Category.move)
  .delete('/category/:ids', User.signinRequired, Category.del)



//广货基地
var Industrial = require('../controllers/industrial');
router
  // 专业镇分类
  .post('/industrialIndexCate', User.signinRequired, Industrial.saveCate)
  .get('/industrialIndexCate',User.signinRequired, Industrial.getCate)
  // 专业镇同步
  .post('/industrial/zyz/sync', User.signinRequired, Industrial.syncZyz)
  .get('/industrial',User.signinRequired, Industrial.get)
  .get('/industrial/cluster',Industrial.getCluster)
  .post('/industrial', User.signinRequired, Industrial.save)
  .delete('/industrial/:ids', User.signinRequired, Industrial.del)
  .get('/industrial/:id', User.signinRequired, Industrial.getOne)
  // 专业镇大首页推荐
  // 活动
  .post('/industrial/indexAct',User.signinRequired,Industrial.saveIndexAct)
  .get('/industrial/indexAct/:id',User.signinRequired,Industrial.getIndexAct)
  .delete('/industrial/indexAct/:ids',User.signinRequired,Industrial.delIndexAct)
  // 批发中心
  .post('/industrial/indexWS',User.signinRequired,Industrial.saveIndexWS)
  .get('/industrial/indexWS/:id',User.signinRequired,Industrial.getIndexWS)
  .delete('/industrial/indexWS/:ids',User.signinRequired,Industrial.delIndexWS)
  // 批发中心反馈
  .post('/industrial/indexFB',User.signinRequired,Industrial.saveIndexFB)
  .get('/industrial/indexFB/:id',User.signinRequired,Industrial.getIndexFB)
  .delete('/industrial/indexFB/:ids',User.signinRequired,Industrial.delIndexFB)

  // 具体专业镇的banner
  //banner
  .post('/industrial/townbanner', User.signinRequired, Industrial.saveTownBanner)
  .get('/industrial/townbanner/:id',User.signinRequired, Industrial.getTownBanner)
  .delete('/industrial/townbanner/:ids',User.signinRequired, Industrial.delTownBanner)
  // 活动
  .post('/industrial/townact',User.signinRequired,Industrial.saveTownAct)
  .get('/industrial/townact/:id',User.signinRequired, Industrial.getTownAct)
  .delete('/industrial/townact/:ids',User.signinRequired, Industrial.delTownAct)
  // 反馈
  .post('/industrial/townfb',User.signinRequired,Industrial.saveTownFB)
  .get('/industrial/townfb/:id',User.signinRequired, Industrial.getTownFB)
  .delete('/industrial/townfb/:ids',User.signinRequired, Industrial.delTownFB)
  // 具体专业镇的top100
  .post('/industrial/tophundred', User.signinRequired, Industrial.saveTops)
  .get('/industrial/tophundred/:id',User.signinRequired, Industrial.getTops)
  .delete('/industrial/tophundred/:ids',User.signinRequired,Industrial.delTops)
  // 具体专业镇的类目
  .post('/industrial/townmenu',User.signinRequired,Industrial.saveTownMenu)
  .get('/industrial/townmenu/:id',User.signinRequired,Industrial.getTownMenu)
  .delete('/industrial/townmenu/:ids',User.signinRequired,Industrial.delTownCate)
  // 某个专业镇活动页面
  .post('/industrial/activityact',User.signinRequired,Industrial.saveActivityAct)
  .get('/industrial/activityact/:id',User.signinRequired,Industrial.getActivityAct)
  .delete('/industrial/activityact/:ids',User.signinRequired,Industrial.delActivityAct)

  .post('/industrial/activitybanner',User.signinRequired,Industrial.saveActivityBanner)
  .get('/industrial/activitybanner/:id',User.signinRequired,Industrial.getActivityBanner)
  .delete('/industrial/activitybanner/:ids',User.signinRequired,Industrial.delActivityBanner)
  // app推荐
  .post('/industrial/apprecommon',User.signinRequired,Industrial.saveAppRecommon)
  .get('/industrial/apprecommon/:id',User.signinRequired,Industrial.getAppRecommon)
  .delete('/industrial/apprecommon/:ids',User.signinRequired,Industrial.delAppRecommon)
  // appbanner
  .post('/industrial/appbanner',User.signinRequired,Industrial.saveAppBanner)
  .get('/industrial/appbanner/:id',User.signinRequired,Industrial.getAppBanner)
  .delete('/industrial/appbanner/:ids',User.signinRequired,Industrial.delAppBanner)
  // 专业镇所有活动
  .post('/industrial/synAllActivitys/:id',User.signinRequired,Industrial.synAllActivitys)
  .post('/industrial/saveAAct',User.signinRequired,Industrial.saveAAct)
  .get('/industrial/getAllActivitys/:id',User.signinRequired,Industrial.getAllActivitys)

  // app接口
  .all('/industrial/apptophundred/:id', Industrial.getapptops)
  .all('/industrialappcate', Industrial.getappcate)
  .all('/industrialappbanner',Industrial.getappbanners)
  .all('/industrialapptowns',Industrial.getapptowns)
  .all('/industrialappArea', Industrial.getIndustrialappArea)




//专业市场
var Market = require('../controllers/market');
router
  .get('/syncZysc', User.signinRequired, Market.syncZysc)
  .get('/market', User.signinRequired, Market.get)
  .delete('/market/:ids', User.signinRequired, Market.del)
  .get('/market/one/:id', User.signinRequired, Market.getOne)
  .get('/marketOne', User.signinRequired, Market.get1)
  .post('/market', User.signinRequired, Market.saveMarket)
 
  // 首页banner
  .post('/market/banner', User.signinRequired, Market.addBanner)
  .get('/market/bannerList', User.signinRequired, Market.getBanner)
  .get('/market/getOneBanner', User.signinRequired, Market.getOneBanner)    
  .post('/market/delOneBanner', User.signinRequired, Market.delOneBanner)   
  // 首页的recommendation
  .get('/market/getRecommendation', User.signinRequired, Market.getRecommendation)
  .post('/market/saveRecommendation', User.signinRequired, Market.saveRecommendation)
  .get('/market/getOneRecommendation', User.signinRequired, Market.getOneRecommendation)    
  .post('/market/delOneRecommendation', User.signinRequired, Market.delOneRecommendation)
   // 首页的recommendation管理产品
  .get('/market/getRecommendProduct', User.signinRequired, Market.getRecommendProduct)
  .post('/market/saveRecommendProduct', User.signinRequired, Market.saveRecommendProduct)
  .get('/market/getOneRecommendProduct', User.signinRequired, Market.getOneRecommendProduct)    
  .post('/market/delRecommendProduct', User.signinRequired, Market.delRecommendProduct)
 // 首页的hot product
  .get('/market/getHot', User.signinRequired, Market.getHot)
  .post('/market/saveHot', User.signinRequired, Market.saveHot)
  .get('/market/editHot', User.signinRequired, Market.editHot)    
  .post('/market/delHot', User.signinRequired, Market.delHot)
   // 首页的hot product管理产品
  .get('/market/getHotProduct', User.signinRequired, Market.getHotProduct)
  .post('/market/saveHotProduct', User.signinRequired, Market.saveHotProduct)
  .get('/market/editHotProduct', User.signinRequired, Market.editHotProduct)    
  .post('/market/delHotProduct', User.signinRequired, Market.delHotProduct)
   // 首页的bestseller
  .get('/market/getBestSeller', User.signinRequired, Market.getBestSeller)
  .post('/market/saveBestSeller', User.signinRequired, Market.saveBestSeller)
  .get('/market/getOneBestSeller', User.signinRequired, Market.getOneBestSeller)    
  .post('/market/delBestSeller', User.signinRequired, Market.delBestSeller)
   // 首页的bestseller管理产品
  .get('/market/getBestProduct', User.signinRequired, Market.getBestProduct)
  .post('/market/saveBestProduct', User.signinRequired, Market.saveBestProduct)
  .get('/market/getOneBestProduct', User.signinRequired, Market.getOneBestProduct)    
  .post('/market/delBestProduct', User.signinRequired, Market.delBestProduct)
  // 专业市场首页的推荐活动
  .get('/market/getIndexActive', User.signinRequired, Market.getIndexActive)
  .post('/market/addIndexActive', User.signinRequired, Market.addIndexActive)
  .get('/market/editIndexActive', User.signinRequired, Market.editIndexActive)
  .post('/market/delIndexActive', User.signinRequired, Market.delIndexActive) 
  // 专业市场反馈
  .get('/market/getFeedback', User.signinRequired, Market.getFeedback)
  .post('/market/addFeedback', User.signinRequired, Market.addFeedback)
  .get('/market/editFeedback', User.signinRequired, Market.editFeedback)    
  .post('/market/delFeedback', User.signinRequired, Market.delFeedback) 
  // 活动页banner
  .get('/market/getActiveBanner', User.signinRequired, Market.getActiveBanner)
  .post('/market/addActiveBanner', User.signinRequired, Market.addActiveBanner)
  .get('/market/editActiveBanner', User.signinRequired, Market.editActiveBanner)    
  .post('/market/delActiveBanner', User.signinRequired, Market.delActiveBanner) 
  // 活动页面的活动
  .get('/market/getActive', User.signinRequired, Market.getActive)
  .post('/market/addActive', User.signinRequired, Market.addActive)
  .get('/market/editActive', User.signinRequired, Market.editActive)    
  .post('/market/delActive', User.signinRequired, Market.delActive) 
  // 专业市场类目页面
  .get('/market/getCate', User.signinRequired, Market.getCate)
  .post('/market/saveCate', User.signinRequired, Market.saveCate)    
  .delete('/market/delCate/:ids', User.signinRequired, Market.delCate)
  // 专业市场所有活动
  .post('/market/synAllActivitys/:id',User.signinRequired,Market.synAllActivitys)
  .post('/market/saveAAct',User.signinRequired,Market.saveAAct)
  .get('/market/getAllActivitys/:id',User.signinRequired,Market.getAllActivitys)
  .post('/market/cutdata',User.signinRequired,Market.dataCutter)

  .get('/market/appmarket',Market.getappmarket)
// 创新产品设计
// 创新产品首页
var Innovative = require('../controllers/innovative');
  router
  .get('/innovative/getAllBanner', User.signinRequired, Innovative.getBanner)
  .post('/innovative/saveBanner', User.signinRequired, Innovative.saveBanner)
  .delete('/innovative/delBanner/:id', User.signinRequired, Innovative.delBanner) 
  // 创新设计频道页
  .get('/innovative/syncCate', User.signinRequired, Innovative.syncCate)
  .get('/innovative/getCate', User.signinRequired, Innovative.getCate)
  .post('/innovative/shift', User.signinRequired, Innovative.shift)
  // 创新设计产品
 .get('/innovative/getProduct', User.signinRequired, Innovative.getProduct)
  .post('/innovative/saveProduct', User.signinRequired, Innovative.saveProduct)
  .delete('/innovative/delProduct/:id', User.signinRequired, Innovative.delProduct)
  //创新设计app接口
  .all('/innovative/cate', Innovative.cate)
  .all('/innovative/product',Innovative.innovativeAppProduct)
//样品中心
var Sample = require('../controllers/sample');
router
  //样品分类
  .get('/sample/sort', User.signinRequired, Sample.getSort)
  .post('/sample/sort', User.signinRequired, Sample.saveSort)
  .delete('/sample/sort/:id', User.signinRequired, Sample.delSort)
  //产品
  .get('/sample/product/:id', User.signinRequired, Sample.getProduct)
  .post('/sample/product', User.signinRequired, Sample.saveProduct)
  .get('/sample/like/:id', Sample.productLike)
  .delete('/sample/product/:id', User.signinRequired, Sample.delProduct)

//产品管理
var Product = require('../controllers/product');
router
  .get('/product', User.signinRequired, Product.getProductAll)
  .post('/product', User.signinRequired, Product.saveProduct)
  .delete('/product/:ids', User.signinRequired, Product.delProduct)


//广告管理
var Ads = require('../controllers/ads');
router
  .get('/ads', User.signinRequired, Ads.getAdsAll)
  .post('/ads', User.signinRequired, Ads.saveAds)
  .delete('/ads/:ids', User.signinRequired, Ads.delAds)
  .post('/appIndexAds', Ads.getAppIndexAds)

//商家店铺
var Shops = require('../controllers/shops');
router
  .get('/shops', User.signinRequired, Shops.getShopsAll)
  .post('/shops', User.signinRequired, Shops.saveShops)
  .delete('/shops/:ids', User.signinRequired, Shops.delShops)

//模板修改
var ViewsManager = require('../controllers/viewsManager');
router
  .get('/viewsAll', User.signinRequired, ViewsManager.getViewsFiles)
  .get('/views', User.signinRequired, ViewsManager.getFileContent)
  .post('/views', User.signinRequired, ViewsManager.saveFileContent)

  //促销活动管理
var Special = require('../controllers/special');
router
  .get('/getAllBanner', User.signinRequired, Special.getAllBanner)
  .post('/saveBanner', User.signinRequired, Special.saveBanner)
  .delete('/specialBanner/:ids', User.signinRequired, Special.delBanner)
  .post('/special/syncOverdueProducts/:time', User.signinRequired, Special.syncOverdueProducts)
  //样品分类
  .get('/special/cate', User.signinRequired, Special.getCate)
  .post('/special/cate', User.signinRequired, Special.saveCate)
  .delete('/special/cate/:id', User.signinRequired, Special.delCate)
  .post('/special/syncProduct', User.signinRequired, Special.syncProduct)
  .get('/special/product/:id', User.signinRequired, Special.getProduct)
  .post('/special/product', User.signinRequired, Special.saveProduct)
  .delete('/special/product/:id', User.signinRequired, Special.delProduct)
  //促销活动app接口
  .all('/promotion/cate', Special.getAppCate)
  .all('/promotion/product/:id', Special.getAppProduct)

// 快速航运
var FastShip = require('../controllers/fastship');
router
  // 快速航运首页模块
  .get('/fastship/getIndexModuls',User.signinRequired,FastShip.getIndexModuls)
  .post('/fastship/saveIndexModuls',User.signinRequired,FastShip.saveIndexModuls)
  .delete('/fastship/delIndexModuls/:ids',User.signinRequired,FastShip.delIndexModuls)
  // 快速航运首页楼层
  .get('/fastship/getIndexFloor',User.signinRequired,FastShip.getIndexFloor)
  .post('/fastship/saveIndexFloor',User.signinRequired,FastShip.saveIndexFloor)
  .delete('/fastship/delIndexFloor/:ids',User.signinRequired,FastShip.delIndexFloor)
  // 快速航运首页楼层产品
  .get('/fastship/getIndexFloorPro',User.signinRequired,FastShip.getIndexFloorPro)
  .post('/fastship/saveIndexFloorPro',User.signinRequired,FastShip.saveIndexFloorPro)
  .delete('/fastship/delIndexFloorPro/:ids',User.signinRequired,FastShip.delIndexFloorPro)
  // 快速航运首页楼层类目
  .get('/fastship/getIndexFloorCate',User.signinRequired,FastShip.getIndexFloorCate)
  .post('/fastship/saveIndexFloorCate',User.signinRequired,FastShip.saveIndexFloorCate)
  .delete('/fastship/delIndexFloorCate/:ids',User.signinRequired,FastShip.delIndexFloorCate)

  // 一级类目
  .get('/fastship/getFirstStair',User.signinRequired,FastShip.getFirstStair)
  .post('/fastship/saveFirstStair',User.signinRequired,FastShip.saveFirstStair)
  .delete('/fastship/delFirstStair/:ids',User.signinRequired,FastShip.delFirstStair)
  // 二级类目
  .get('/fastship/getSecStair',User.signinRequired,FastShip.getSecStair)
  .post('/fastship/saveSecStair',User.signinRequired,FastShip.saveSecStair)
  .delete('/fastship/delSecStair/:ids',User.signinRequired,FastShip.delSecStair)
  // 三级类目
  .get('/fastship/getThrStair',User.signinRequired,FastShip.getThrStair)
  .post('/fastship/saveThrStair',User.signinRequired,FastShip.saveThrStair)
  .delete('/fastship/delThrStair/:ids',User.signinRequired,FastShip.delThrStair)
  // 频道类目
  .get('/fastship/getChennalCate',User.signinRequired,FastShip.getChennalCate)
  .post('/fastship/saveChennalCate',User.signinRequired,FastShip.saveChennalCate)
  .delete('/fastship/delChennalCate/:ids',User.signinRequired,FastShip.delChennalCate)
  // 频道产品
  .get('/fastship/getProduct',User.signinRequired,FastShip.getProduct)
  .post('/fastship/saveProduct',User.signinRequired,FastShip.saveProduct)
  .delete('/fastship/deleteProduct/:ids',User.signinRequired,FastShip.delProduct)
  // pc获取快速航运产品
  .get('/fastship/products',FastShip.getProducts)
// 电子杂志
var Ezine = require('../controllers/ezine');
  router
    // 推荐
    .get('/ez/getrecommend',User.signinRequired,Ezine.getRecommend)
    .post('/ez/saverecommend',User.signinRequired,Ezine.saveRecommend)
    .delete('/ez/delrecommend/:ids',User.signinRequired,Ezine.delRecommend)
    // 产业集群
    .get('/ez/getindustrial',User.signinRequired,Ezine.getIndustrial)
    .post('/ez/saveindustrial',User.signinRequired,Ezine.saveIndustrial)
    .delete('/ez/delindustrial/:ids',User.signinRequired,Ezine.delIndustrial)
    // 类目
    .get('/ez/getcategory',User.signinRequired,Ezine.getCategory)
    .post('/ez/savecategory',User.signinRequired,Ezine.saveCategory)
    .delete('/ez/delcategory/:ids',User.signinRequired,Ezine.delCategory)
    // 企业
    .get('/ez/getcompony',User.signinRequired,Ezine.getCompony)
    .post('/ez/savecompony',User.signinRequired,Ezine.saveCompony)
    .delete('/ez/delcompony/:ids',User.signinRequired,Ezine.delCompony)
    // redis缓存
    .get('/ez/setCateCache',User.signinRequired,Ezine.setCateCache)
    // web项目接口
    .get('/ez/getwebcompony',Ezine.getwebcompony)
    .get('/ez/getwebcategory',Ezine.getwebcategory)
    .get('/ez/getwebindustrial',Ezine.getwebindustrial)
    .get('/ez/getwebcompony/district',Ezine.getwebcomponydistrict)
    .get('/ez/getwebindustrial/district',Ezine.getwebindustrialdistrict)
    // 电子杂志APP接口
    .all('/ez/appezcate',Ezine.getAppEZCate)
    .all('/ez/appcategory',Ezine.getAppCategory)
    .all('/ez/appindustrial',Ezine.getAppIndustrial)
    .all('/ez/appcompanycate',Ezine.getAppCompanyCate)
    .all('/ez/appcompanyall',Ezine.getAppCompanyAll)
    .all('/ez/appcompanythelast',Ezine.getAppCompanyTheLast)



var ActivityForecast = require('../controllers/activityForecast');
  router
    // index
    .get('/af/getforecastIndex',User.signinRequired,ActivityForecast.getForecastIndex)
    .post('/af/saveforecastIndex',User.signinRequired,ActivityForecast.saveForecastIndex)
    .delete('/af/delforecastIndex/:ids',User.signinRequired,ActivityForecast.delForecastIndex)
    // cate
    .get('/af/getforecastCate',User.signinRequired,ActivityForecast.getForecastCate)
    .post('/af/saveforecastCate',User.signinRequired,ActivityForecast.saveForecastCate)
    .delete('/af/delforecastCate/:ids',User.signinRequired,ActivityForecast.delForecastCate)
    // forecast
    .get('/af/getforecast',User.signinRequired,ActivityForecast.getForecast)
    .post('/af/saveforecast',User.signinRequired,ActivityForecast.saveForecast)
    .delete('/af/delforecast/:ids',User.signinRequired,ActivityForecast.delForecast)

var FairActive = require("../controllers/fair-active");
  router
    .post('/fairactive/savefairactive',User.signinRequired,FairActive.syncFairActive)
    .get('/fairactive/getfairactive',User.signinRequired,FairActive.getFairAct)

    // app接口
    .post('/fairactive/app',FairActive.getAPPFairAct)

    // PC
    .post('/fairactive/banner/center',FairActive.getFairBanner)





//上传文件
router.post('/uploading', User.signinRequired, function(req, res, next) {
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({uploadDir: './public/upload/'});
  //上传完成后处理
  form.parse(req, function(err, fields, files) {
    var filesTmp = JSON.stringify(files,null,2);
    if(err){
      //console.log('parse error: ' + err);
    } else {
      //console.log('parse files: ' + filesTmp);
      var inputFile = files.file[0];

      var originalName = inputFile.originalFilename;

      var timestamp = Date.now()
      var type = originalName.substr(originalName.lastIndexOf('.'), originalName.length);

      var uploadedPath = inputFile.path;
      var dstPath = './public/upload/' + timestamp + type

      //重命名为真实文件名
      fs.rename(uploadedPath , dstPath, function(err) {
        if(err){
          //console.log('rename error: ' + err);
        } else {
          //console.log('rename ok');
          var resulte = {
            status: 1,
            data: {
              domain: 'http://localhost:3000',
              url: dstPath.replace('./public', ''),
              size: inputFile.size
            }
          }
          res.json(resulte)
        }
      });
    }
  });
});

module.exports = router;

