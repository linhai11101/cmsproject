var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var mongoStore = require('connect-mongo')(session)
var redisStore = require('connect-redis')(session)
var mongoose = require('mongoose');
var _ = require('underscore');
var intervalupdata = require('./util/intervalupdata.js'); //定时器
var router = express.Router();
var config = require('./config');
var logger = require('./middlewares/requireLog'); //日志


//三级域名要用
var Public = require('./controllers/public');
var Cluster = require('./models/cluster');
var eventproxy = require('eventproxy');
var IndustrialTownMenu = require('./models/industrialTownMenu');
var IndustrialTownMenu = require('./models/industrialTownMenu');
var IndustrialTops = require('./models/industrialTops');
var IndustrialTownBanner = require('./models/industrialTownBanner');
var IndustrialTownAct = require('./models/industrialTownAct');
var IndustrialTownFB = require('./models/industrialTownFB');
var IndustrialAllActivitys = require('./models/industrialallactivitys');
var IndustrialIndexCate = require('./models/industrialIndexCate');
var IndustrialIndexAct = require('./models/industrialIndexAct');
var IndustrialIndexWS = require('./models/industrialIndexWS');
var IndustrialIndexFB = require('./models/industrialIndexFB');
var IndustrialActivityAct = require('./models/industrialActivityAct');
var IndustrialActivityBanner = require('./models/industrialActivityBanner');

var MarketBanner = require('./models/marketBanner');
var MarketRecommendation = require('./models/marketRecommendation');
var MarketRecommendProduct = require('./models/marketRecommendProduct');
var MarketHot = require('./models/marketHot');
var MarketHotProduct = require('./models/marketHotProduct');
var MarketBest = require('./models/marketBest');
var MarketBestProduct = require('./models/marketBestProduct');
var MarketIndexActive = require('./models/marketIndexActive');
var MarketFeedback = require('./models/marketFeedback');
var MarketActiveBanner = require('./models/marketActiveBanner');
var MarketActive = require('./models/marketActive');
var MarketCate = require('./models/marketCate');
var MarketAllActivitys = require('./models/marketallactivitys');
var MarketMenu = require('./models/marketMenu');
var MarketProduct = require('./models/marketProduct');
var MarketFloor = require('./models/marketFloor');
var MarketContentFloor = require('./models/marketContentFloor');


//链接数据库
var dbUrl = config.URL;
var db = mongoose.connect(dbUrl);
db.connection.on("error", function(error) { console.log("数据库连接失败：" + error); });
db.connection.on("open", function() { console.log("------数据库连接成功00！------"); });


var app = express();

//设置模板及引擎
var ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.use(function(req, res, next) {

    var domainUrl = req.headers.host;
    var url = req.url;
    var domainPath = req.path;
    var index = domainUrl.indexOf(".");
    var zyzName = domainUrl.substring(0, index);
    var id = "";
    if (zyzName) {
        if (domainUrl.indexOf("industrial") != -1) {
            Cluster.find({ sld: zyzName, clusterType: 1 }) //clusterType 1:为专业镇，2为专业市场
                .exec(function(err, req) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(req);
                    if(req.length!=0){
                      id = req[0].iwId;
                    }else{
                      next()
                    }
                    
                    var ep = new eventproxy();
                    var path = req.path;
                    if (url == "/") {
                       
                        ep.all('base', 'menu', 'slide', 'topBrands', 'townAct', 'markets', 'comment', 'adPic',
                            function(base, menu, slide, topBrands, townAct, markets, comment, adPic) {
                              res.type('.html');
                              res.render('industrial/industrial-index', {
                                    base: base,
                                    menus: menu,
                                    slide: slide,
                                    topBrands: topBrands,
                                    townAct: townAct,
                                    markets: markets,
                                    comment: comment,
                                    path: path,
                                    adPic: adPic,
                                    iwId: id,
                                    clusterType: 1
                                })
                            })
                        //base
                        Cluster.find({ iwId: id, clusterType: 1 }, function(err, industrial) {
                            if (err) { console.log(err); return; };
                            var _industrial = JSON.parse(JSON.stringify(industrial));
                          
                            var _relativesArr = _industrial.length != 0 ? _industrial[0].relateIds.split("|") : [];
                            Cluster.find({ iwId: { $in: _relativesArr } }, function(err, relateCluster) {
                                if (err) { console.log(err); return; }
                                if (relateCluster.length != 0) {
                                    _industrial[0].relateIds = relateCluster.splice(0, 3);
                                }

                                if (!_industrial || _industrial.length == 0) {
                                    ep.emit('base', [{ nameEn: '', avatarImage: '', relateIds: [] }]);
                                } else {
                                    ep.emit('base', _industrial);
                                };
                            });
                        });

                        IndustrialTownMenu.find({ iwId: id })
                            .limit(11)
                            .sort('sortId')
                            .exec(function(err, res) {
                                if (err) {
                                    console.log(err)
                                };
                                ep.emit('menu', res || []);
                            })


                        IndustrialTops.find({ iwId: id })
                            .sort('sortId')
                            .exec(function(err, res) {
                                if (err) {
                                    console.log(err)
                                };
                                ep.emit('topBrands', res || []);
                            })
                        //幻灯片
                        IndustrialTownBanner.find({ iwId: id, place: 1 })
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
                        IndustrialTownBanner.find({ iwId: id, place: 2 })
                            .sort('sortId')
                            .limit(1)
                            .exec(function(err, res) {
                                if (err) {
                                    console.log(err);
                                    return;
                                };
                                if (!res || !res.length) {
                                    ep.emit('adPic', [{ link: '', img: '' }]);
                                };
                                ep.emit('adPic', res);
                            })

                        IndustrialTownAct.find({ iwId: id })
                            .sort('sortId')
                            .limit(7)
                            .exec(function(err, res) {
                                if (err) {
                                    console.log(err);
                                    return false;
                                };
                                ep.emit('townAct', res || []);
                            })


                        Cluster.find({ iwId: id, isTop: 1, clusterType: 1 })
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

                        IndustrialTownFB.find({ iwId: id })
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

                    if (url) {

                        if (url.indexOf("products") != -1) {

                            var ep = new eventproxy();

                            var cateId = 0;
                            var path = req.path;

                            var search = {
                                iwId: id,
                                clusterType: 1
                            };
                            ep.all('base', 'category', function(base, category) {
                                res.type('.html');
                                res.render('industrial/industrial-products', {
                                    base: base,
                                    category: category,
                                    cateId: cateId,
                                    path: path,
                                    iwId: id,
                                    clusterType: 1,
                                    type: "Products"

                                })
                            });

                            Cluster.find(search, function(err, industrial) {
                                if (err) {
                                    console.log(err);
                                };
                                if (!industrial || !industrial.length) {
                                    ep.emit('base', []);
                                    return false;
                                };
                                ep.emit('base', industrial);
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


                        if (url.indexOf("activity") != -1) {

                            var iwId = id;
                            var path = req.path;
                            var ep = new eventproxy;
                            ep.all('base', 'banner1', 'banner2', 'banner3', function(base, banner1, banner2, banner3) {
                                res.type('html');
                                res.render('industrial/industrial-activity', {
                                    title: '专业镇活动',
                                    iwId: iwId,
                                    path: path,
                                    base: base,
                                    banner1: banner1,
                                    banner2: banner2,
                                    banner3: banner3,
                                    clusterType: 1
                                })
                            });
                            //活动 
                            IndustrialActivityAct.find({ 'iwId': iwId })
                                .limit(4)
                                .sort('sortId')
                                .exec(function(err, activityact) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    };
                                    if (!activityact || !activityact.length) {
                                        Cluster.find({ 'iwId': iwId, clusterType: 1 })
                                            .sort('sortId')
                                            .exec(function(err, industrial) {
                                                if (err) {
                                                    console.log(err);
                                                    return;
                                                };
                                                if (!industrial || !industrial.length) {
                                                    ep.emit('base', [{ logo: '', allNull: true }]);
                                                } else {
                                                    ep.emit('base', [{ logo: industrial[0].logo, allNull: true }]);
                                                };
                                            })
                                        return false;
                                    };
                                    Cluster.find({ 'iwId': iwId, clusterType: 1 })
                                        .sort('sortId')
                                        .exec(function(err, industrial) {
                                            if (err) {
                                                console.log(err);
                                                return;
                                            };
                                            if (!industrial || !industrial.length) {
                                                activityact[0].logo = '';
                                            } else {
                                                activityact[0].logo = industrial[0].logo;
                                            };
                                            activityact[0].allNull = false;
                                            ep.emit('base', activityact);
                                        })

                                })

                            // banner
                            IndustrialActivityBanner.find({ 'iwId': iwId, 'place': 1 })
                                .sort('sortId')
                                .limit(5)
                                .exec(function(err, banner1) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    };
                                    if (!banner1 || !banner1.length) {
                                        ep.emit('banner1', []);
                                        return false;
                                    };
                                    ep.emit('banner1', banner1);
                                })
                            IndustrialActivityBanner.find({ 'iwId': iwId, 'place': 2 })
                                .limit(1)
                                .exec(function(err, banner2) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    };
                                    if (!banner2 || !banner2.length) {
                                        ep.emit('banner2', [{ img: '', link: '' }]);
                                        return false;
                                    };
                                    ep.emit('banner2', banner2);
                                })
                            IndustrialActivityBanner.find({ 'iwId': iwId, 'place': 3 })
                                .limit(1)
                                .exec(function(err, banner3) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    };
                                    if (!banner3 || !banner3.length) {
                                        ep.emit('banner3', [{ img: '', link: '' }]);
                                        return false;
                                    };
                                    ep.emit('banner3', banner3);
                                })




                        }




                        if (url.indexOf("activity-detail") != -1) {

                            var iwId = id;
                            var index = domainPath.lastIndexOf("/") + 1;
                            var actId = domainPath.substring(index);

                            var path = req.path;
                            var ep = new eventproxy();
                            //base

                            ep.all('base', 'aact', function(base, aact) {
                                res.type('.html')
                                res.render('industrial/industrial-activity-detail', {
                                    base: base,
                                    path: path,
                                    iwId: iwId,
                                    actId: actId,
                                    aact: aact,
                                    clusterType: 1
                                })
                            })

                            Cluster.find({ iwId: iwId, clusterType: 1 }, function(err, industrial) {
                                if (err) { console.log(err); };
                                if (!industrial || industrial.length == 0) {
                                    var industrial = [{ nameEn: '', avatarImage: '', logo: '' }];
                                };
                                console.log(industrial);
                                ep.emit('base', industrial);
                            });
                            var search = { iwId: iwId, isRecommend: 1 };
                            IndustrialAllActivitys.find(search)
                                .sort('sortId')
                                .exec(function(err, resaact) {
                                    if (err) { console.log(err); };
                                    if (!resaact || resaact.length == 0) {
                                        var resaact = [];
                                    };
                                    ep.emit('aact', resaact);
                                })


                        }


                        if (url.indexOf("apply") != -1) {

                            var iwId = id;
                            var path = req.path;
                            //base
                            Cluster.find({ iwId: iwId, clusterType: 1 }, function(err, industrial) {
                                if (err) {
                                    console.log(err);
                                };
                                if (!industrial || !industrial.length) {
                                    industrial = { logo: '' };
                                };
                                res.render('industrial/industrial-apply', {
                                    base: industrial,
                                    path: path,
                                    logo: industrial.logo,
                                    iwId: iwId,
                                    clusterType: 1
                                })
                            });


                        }



                        if (url.indexOf("comment-list") != -1) {

                            var iwId = id;
                            var path = req.path;
                            var search = {
                                iwId: iwId,
                                clusterType: 1
                            };
                            Cluster.find(search, function(err, industrial) {
                                if (err) {
                                    console.log(err);
                                }
                                res.render('industrial/industrial-comment-list', {
                                    iwId: iwId,
                                    base: industrial,
                                    path: path,
                                    logo: industrial.logo,
                                    clusterType: 1
                                })
                            });


                        }


                        if (url.indexOf("comment-detail") != -1) {
                            var iwId = id;
                            var index = domainPath.lastIndexOf("/") + 1;
                            var detailId = domainPath.substring(index);
                            console.log(detailId);

                            var path = req.path;
                            var search = {
                                iwId: iwId,
                                clusterType: 1
                            };
                            Cluster.find(search, function(err, industrial) {
                                if (err) {
                                    console.log(err);
                                };
                                if (!industrial || !industrial.length) {
                                    industrial = { logo: '' };
                                };
                                res.render('industrial/industrial-comment-detail', {
                                    base: industrial,
                                    path: path,
                                    detailId: detailId,
                                    logo: industrial.logo,
                                    iwId: iwId,
                                    clusterType: 1
                                })
                            });

                        }



                        if (url.indexOf("introduce") != -1) {
                            var iwId = id;
                            var path = req.path;
                            var ep = new eventproxy();
                            ep.all('base', function(base) {
                                res.type('.html');
                                res.render('industrial/industrial-introduce', {
                                    base: base,
                                    path: path,
                                    content: base.content,
                                    iwId: iwId,
                                    logo: base.logo,
                                    clusterType: 1
                                })
                            })
                            Cluster.find({ iwId: iwId, clusterType: 1 }, function(err, industrial) {
                                if (err) { console.log(err); };
                                if (!industrial || industrial.length == 0) {
                                    var industrial = [{ nameEn: '', avatarImage: '' }];
                                };
                                ep.emit('base', industrial);
                            });

                        }



                        if (url.indexOf("publish") != -1) {
                            var iwId = id;
                            var path = req.path;
                            //base
                            Cluster.find({ iwId: iwId, clusterType: 1 }, function(err, industrial) {
                                if (err) {
                                    console.log(err);
                                };
                                if (!industrial || !industrial.length) {
                                    industrial = { logo: '' };
                                };
                                res.render('industrial/industrial-publish', {
                                    base: industrial,
                                    path: path,
                                    iwId: iwId,
                                    logo: industrial.logo,
                                    clusterType: 1
                                })
                            });

                        }

                        //   ==========================  

                    }




                });


        }else if (domainUrl.indexOf("market") != -1) {   // 专业市场拦截开始
            Cluster.find({ sld: zyzName, clusterType: 2 })
                .exec(function(err, req) {
                    if (err) {
                        console.log(err);
                    }
                    iwId = req[0].iwId;
                    var ep = new eventproxy();
                    var path = req.path;
                    if (url == "/") {

                        ep.all("base", "banner", "entry", 'recommends', 'recommendProduct', "hotProduct", "bestProduct", "indexActive", "feedback", "category",
                            function(base, banner, entry, recommends, recommendProduct, hotProduct, bestProduct, indexActive, feedback, category) {
                                res.type('.html');
                                res.render('industrial/market-index', {
                                    base: base,
                                    banner: banner,
                                    entry: entry,
                                    recommends: recommends,
                                    recommendProduct: recommendProduct,
                                    hotProduct: hotProduct,
                                    bestProduct: bestProduct,
                                    indexActive: indexActive,
                                    feedback: feedback,
                                    category: category,
                                    path: path,
                                    iwId: iwId,
                                    clusterType: 2
                                })
                            }
                        );
                        Cluster.find({ iwId: iwId, clusterType: 2 }, function(err, _market) {
                            if (err) { console.log(err); };
                            if (!_market || !_market.length) {
                                ep.emit('base', [{ img: '', link: '', logo: '', }]);
                                return;
                            };
                            console.log(_market);
                            ep.emit('base', _market || []);
                        })

                        // //专业市场首页banner
                        MarketBanner.find({ iwId: iwId, place: 0 })
                            .limit(5)
                            .sort('sortId')
                            .exec(function(err, banner) {
                                if (err) {
                                    console.log(err)
                                };
                                console.log(banner);
                                ep.emit('banner', banner || []);
                            })
                        MarketBanner.find({ iwId: iwId, place: 1 })
                            .limit(1)
                            .sort('sortId')
                            .exec(function(err, entry1) {
                                if (err) {
                                    console.log(err)
                                };
                                if (!entry1 || !entry1.length) {
                                    ep.emit('entry', [{ img: '', link: '' }]);
                                    return false;
                                };
                                ep.emit('entry', entry1);
                            })

                        // //专业市场recommendations
                        MarketRecommendation.find({ iwId: iwId })
                            .limit(2)
                            .sort('sortId')
                            .exec(function(err, recommend) {
                                if (err) {
                                    console.log(err)
                                };
                                ep.emit('recommends', recommend || []);
                            })


                        MarketRecommendation.find({ iwId: iwId })
                            .limit(2)
                            .sort('sortId')
                            .exec(function(err, recommend) {
                                if (err) {
                                    console.log(err)
                                };
                                if (!recommend || !recommend.length) {
                                    ep.emit('recommendProduct', [{ products: [] }]);
                                    return false;
                                };
                                var a = 0;
                                var _recommend = JSON.parse(JSON.stringify(recommend));
                                _recommend.forEach(function(value, index) {
                                    MarketRecommendProduct.find({ iwId: iwId, shopId: value.shopId })
                                        .limit(6)
                                        .sort("sortId")
                                        .exec(function(err, product) {
                                            a++;
                                            _recommend[index].products = product;
                                            if (a == _recommend.length) {
                                                console.log(_recommend);
                                                ep.emit('recommendProduct', _recommend);
                                            }
                                        });
                                })
                            })
                        // //专业市场hotproduct

                        MarketHot.find({ iwId: iwId })
                            .limit(3)
                            .sort('sortId')
                            .exec(function(err, hot) {
                                if (err) {

                                };
                                if (!hot || !hot.length) {
                                    ep.emit('hotProduct', [{ products: [] }]);

                                    return false;
                                };

                                var _hot = JSON.parse(JSON.stringify(hot));
                                var a = 0;
                                _hot.forEach(function(value, index) {
                                    MarketHotProduct.find({ iwId: iwId, shopId: value.shopId })
                                        .limit(4)
                                        .sort("sortId")
                                        .exec(function(err, product) {
                                            a++;
                                            _hot[index].products = product;
                                            if (a == _hot.length) {
                                                console.log(_hot)
                                                ep.emit('hotProduct', _hot)
                                            }
                                        });
                                })
                            })


                        // //专业市场bestSeller

                        MarketBest.find({ iwId: iwId })
                            .limit(3)
                            .sort('sortId')
                            .exec(function(err, best) {
                                if (err) {
                                    console.log(err)
                                };
                                if (!best || !best.length) {
                                    ep.emit('bestProduct', [{ products: [] }]);
                                    return false;
                                };
                                var _best = JSON.parse(JSON.stringify(best));
                                var a = 0;
                                _best.forEach(function(value, index) {
                                    MarketBestProduct.find({ iwId: iwId, shopId: value.shopId })
                                        .limit(3)
                                        .sort("sortId")
                                        .exec(function(err, product) {
                                            a++;
                                            _best[index].products = product;
                                            if (a == _best.length) {
                                                console.log(_best)
                                                ep.emit('bestProduct', _best);
                                            }
                                        });
                                })
                            })
                        // 专业市场首页的活动
                        MarketIndexActive.find({ iwId: iwId })
                            .limit(3)
                            .sort('sortId')
                            .exec(function(err, indexActive) {
                                if (err) {
                                    console.log(err)
                                };
                                ep.emit('indexActive', indexActive || []);
                            })

                        // 反馈
                        MarketFeedback.find({ iwId: iwId })
                            .limit(2)
                            .sort('sortId')
                            .exec(function(err, feedback) {
                                if (err) {
                                    console.log(err)
                                };
                                ep.emit('feedback', feedback || []);
                            })
                        // 类目
                        MarketCate.find({ iwId: iwId })
                            .limit(6)
                            .sort('sortId')
                            .exec(function(err, _category) {
                                if (err) {
                                    console.log(err)
                                };
                                ep.emit('category', _category || []);
                            })


                    }




                    if (url) {

                        if (url.indexOf("products") != -1) {
                            var cateId = 0;
                            var path = req.path;
                            ep.all("base", "category",
                                function(base, category) {
                                    res.type('.html');
                                    res.render('industrial/market-products', {
                                        base: base,
                                        iwId: iwId,
                                        cateId: cateId,
                                        category: category,
                                        path: path,
                                        clusterType: 2,
                                        type: "Products"
                                    })
                                }
                            );

                            Cluster.find({ iwId: iwId, clusterType: 2 }, function(err, market) {
                                if (err) {
                                    console.log(err);
                                }
                                ep.emit('base', market)
                            })
                            // 类目
                            MarketCate.find({ iwId: iwId })
                                .sort('sortId')
                                .exec(function(err, _category) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    if (_category && _category.length) {
                                        var category = _category.slice(0, 6)
                                    }
                                    ep.emit('category', category || []);
                                })

                        }



                        if (url.indexOf("activity") != -1) {

                            ep.all("base", "banner", "upBanner", "bottomBanner", "recommends",
                                function(base, banner, upBanner, bottomBanner, recommends) {
                                    res.type('.html');
                                    res.render('industrial/market-activity', {
                                        base: base,
                                        banner: banner,
                                        upBanner: upBanner,
                                        iwId: iwId,
                                        bottomBanner: bottomBanner,
                                        recommends: recommends,
                                        path: path,
                                        clusterType: 2
                                    })
                                }
                            );
                            Cluster.find({ iwId: iwId, clusterType: 2 }, function(err, _market) {
                                if (err) console.log(err);
                                var market = JSON.parse(JSON.stringify(_market));
                                console.log(market)
                                ep.emit('base', market)
                            })
                            MarketActiveBanner.find({ iwId: iwId, place: 0 }, function(err, banner) {
                                if (err) {
                                    console.log(err);
                                }
                                if (banner && banner.length) {
                                    banner = banner.slice(0, 5)
                                }
                                ep.emit('banner', banner || []);
                            })

                            MarketActiveBanner.find({ iwId: iwId, place: 1 }, function(err, _upBanner) {
                                if (err) {
                                    console.log(err);
                                }
                                var upBanner = JSON.parse(JSON.stringify(_upBanner));
                                ep.emit('upBanner', upBanner || []);
                            })
                            MarketActiveBanner.find({ iwId: iwId, place: 2 }, function(err, _bottomBanner) {
                                if (err) {
                                    console.log(err);
                                }
                                var bottomBanner = JSON.parse(JSON.stringify(_bottomBanner));
                                ep.emit('bottomBanner', bottomBanner || []);
                            })



                            MarketActive.find({ iwId: iwId })
                                .sort('sortId')
                                .exec(function(err, _recommend) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    console.log(_recommend);

                                    if (_recommend && _recommend.length) {
                                        var recommend = _recommend.slice(0, 4)
                                    }
                                    ep.emit('recommends', recommend || []);
                                })

                        }





                        if (url.indexOf("activity-detail") != -1) {
                            var index = domainPath.lastIndexOf("/") + 1;
                            var activeId = domainPath.substring(index);

                            var path = req.path;

                            ep.all("base", "aact", function(base, aact) {
                                res.type('.html');
                                res.render('industrial/market-activity-detail', {
                                    iwId: iwId,
                                    base: base,
                                    activeId: activeId,
                                    aact: aact,
                                    path: path,
                                    clusterType: 2
                                })
                            });

                            Cluster.find({ iwId: iwId, clusterType: 2 }, function(err, _market) {
                                if (err) console.log(err);
                                var market = JSON.parse(JSON.stringify(_market));
                                ep.emit('base', market)
                            });
                            var search = { iwId: iwId, isRecommend: 1 };
                            MarketAllActivitys.find(search)
                                .sort('sortId')
                                .exec(function(err, resaact) {
                                    if (err) { console.log(err); };
                                    if (!resaact || resaact.length == 0) {
                                        var resaact = [];
                                    };
                                    ep.emit('aact', resaact);
                                })



                        }




                        if (url.indexOf("apply") != -1) {

                            ep.all("base",
                                function(base) {
                                    res.type('.html');
                                    res.render('industrial/market-apply', {
                                        base: base,
                                        path: path,
                                        iwId: iwId,
                                        clusterType: 2
                                    })
                                }
                            );

                            Cluster.find({ iwId: iwId, clusterType: 2 }, function(err, market) {
                                if (err) {
                                    console.log(err);
                                };
                                ep.emit('base', market)
                            })


                        }





                        if (url.indexOf("comment-list") != -1) {

                            ep.all("base",
                                function(base) {
                                    res.type('.html');
                                    res.render('industrial/market-comment-list', {
                                        base: base,
                                        iwId: iwId,
                                        path: path,
                                        clusterType: 2
                                    })
                                }
                            );
                            Cluster.find({ iwId: iwId, clusterType: 2 }, function(err, market) {
                                if (err) {
                                    console.log(err);
                                }
                                ep.emit('base', market)
                            })

                        }



                        if (url.indexOf("comment-detail") != -1) {

                            var index = domainPath.lastIndexOf("/") + 1;
                            var detailId = domainPath.substring(index);

                            ep.all("base",
                                function(base) {
                                    res.type('.html');
                                    res.render('industrial/market-comment-detail', {
                                        base: base,
                                        iwId: iwId,
                                        detailId: detailId,
                                        path: path,
                                        clusterType: 2
                                    })
                                }
                            );

                            Cluster.find({ iwId: iwId, clusterType: 2 }, function(err, market) {
                                if (err) {
                                    console.log(err);
                                };
                                ep.emit('base', market)
                            })


                        }


                        if (url.indexOf("introduce") != -1) {

                            ep.all("base",
                                function(base) {
                                    res.type('.html');
                                    res.render('industrial/market-introduce', {
                                        base: base,
                                        path: path,
                                        iwId: iwId,
                                        clusterType: 2
                                    })
                                }
                            );

                            Cluster.find({ iwId: iwId, clusterType: 2 }, function(err, market) {
                                if (err) {
                                    console.log(err);
                                };
                                if (!market || market.length == 0) {
                                    ep.emit('base', [{ avatarImage: '' }]);
                                    return false;
                                };
                                ep.emit('base', market)
                            })



                        }

                    } // if(url)


                });











        }else{

          next();
        }

        // 专业市场拦截结束



    } else {
        next();
    }
});

//app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(cookieParser('gmcms'));
app.use(session({
    secret: 'gmcms',
    cookie: { maxAge: 30 * 60 * 1000 },
    store: new redisStore({
        port: config.redis_port,
        host: config.redis_host,
        db: config.redis_db
    }),
    resave: true,
    rolling: true,
    saveUninitialized: true,
}));


//日志管理
//app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
app.use(logger)

var routes = require('./routes/index');
var apiRouterV1 = require('./routes/api');
var forward = require('./routes/forward');
var _public = require('./routes/open');
app.use('/', routes);
app.use('/', forward);
app.use('/cms/api',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
}, apiRouterV1);
app.use('/cms/api/public', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
}, _public);

//添加全局变量
_.extend(app.locals, {
    assetsPath: config.assets_path,
    domainPath: config.domain_path,
    loginDomain: config.loginDomain,
    imgHost: config.img_host,
    domainCrm: config.java_api_host,
    domain_cms: config.domain_cms,
    domain_url: config.domain_url,
    config: config,
    logo: null
});

_.extend(app.locals, require('./util/render-help')); //裁剪图片
_.extend(app.locals, require('./util/subString')); //截取字符串，后添加"...";
_.extend(app.locals, require('./util/subTime')); //截取时间，保留年月日
_.extend(app.locals, require('./util/prodUrl')); //拼接产品url

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//定时器
intervalupdata.upIndustrialData(600000);
intervalupdata.updateFairActive();


module.exports = app;