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