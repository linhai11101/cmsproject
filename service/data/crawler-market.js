var Superagent = require('superagent');
var Cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var _ = require('underscore');
var mongoose = require('mongoose');

var config = require('../config');
//链接数据库
var dbUrl = config.URL;
//var db = mongoose.connect(dbUrl);

var Ads = require('../models/ads');
var Product = require('../models/product');
var Market = require('../models/market');
var MarketMenu = require('../models/marketMenu');
var MarketProduct = require('../models/marketProduct');
var MarketFloor = require('../models/marketFloor');
var MarketProductFloor = require('../models/marketContentFloor');

var ep = new eventproxy();

Superagent.get('http://www.mr-world.com/market/professionalMarket.cf')
  .end(function(err, res) {
    var resText = res.text;
    var $ = Cheerio.load(resText);



    var $floors = $('.gm-title');
    var $products = $('.gm-conter');

    $floors.each(function(index, el) {
      var $floor = $(el);
      var _floor = new MarketFloor({
        name: index+ '楼',
        img: $floor.find('img').attr('src')
      })
      _floor.save(function(err, res) {
        if(err) return;
        console.log(res.img + '--楼层添加成功');
        product($products[index], res._id)
      })
    });

    function product(el, floorId) {
      var $products = $(el).find('.col-md-3');
      var products = [];
      $products.each(function(index, el) {
        var $product = $(el);
        var type;
        var ishidden = $product.find('a').attr('href') == '#' ? 0 : 1;
        var _product = new Market({
          name: $product.find('strong').text(),
          title: $product.find('p').text(),
          img: $product.find('img').attr('src'),
          appSortId: 999,
          sortId:999,
          floorId: floorId,
          ishidden: ishidden
        })
        _product.save(function(err, res) {
          if(err) return;
          console.log( ': 产品 ->' + res.img);
          ep.emit('market', [$product.find('a').attr('href'), res._id])
        })
      });
    }

    var $prod = $('.gm-container .col-md-3')
    ep.after('market', $prod.length, function(res) {
      console.log(res);
      res.forEach(function(el, index) {
        if(el[0] != '#') {
          var id = el[1];
          Superagent.get(el[0])
            .end(function(err, res) {
              var resText = res.text;
              var $ = Cheerio.load(resText);

              Market.findById(id, function(err, market){
                _market = _.extend(market, {logo: $('.logo img').eq(1).attr('src')})
                _market.save(function(err, ads) {
                  console.log('专业市场: logo')
                });
              })

              var $contains = $('.gm-container');

              menu($contains, id);
              banner($contains.find('#scrol-box-list-id .scrol'), id);
              tuij($contains.find('.a-tuj > div'), id)
              floor($contains.find('.gm-floor'), id)

              function menu($el, floorId){
                var $menu1 = $el.find('.gm-menu-m li');
                //var $menu2 = $el.find('.lemenu .ty');

                $menu1.each(function(index, el) {
                  var $el = $(el)
                  var _menu = new MarketMenu({
                    name: $el.text(),
                    link: $el.find('a').attr('href'),
                    marketId: floorId,
                    parentid: floorId
                  })
                  _menu.save(function(err, res){
                    if(err) return;
                    console.log('菜单->'+ $menu1.text())
                  })
                });
              }

              function banner($el, floorId){
                $el.each(function(index, el) {
                  var $el = $(el);
                  var _ads = new Ads({
                    img: $el.find('img').attr('src'),
                    link: $el.find('a').attr('href'),
                    area: id,
                    sortid: 10
                  })
                  _ads.save(function(err, res) {
                    if(err) return;
                    console.log( 'banner ->' + res.img);
                  })
                });
              }

              function tuij($tuij, floorId){
                $tuij.each(function(index, el) {
                  var $el = $(el);
                  var _product = new Product({
                    name: '第' + (index + 1) + '个',
                    link: $el.find('a').attr('href'),
                    img: $el.find('img').attr('src'),
                    area: floorId
                  })
                  _product.save(function(err, res) {
                    if(err) return;
                    console.log( '推荐 ->' + res.name);
                  })
                });
              }

              function floor($floors, floorId) {
                $floors.each(function(index, el) {
                  var $el = $(el);
                  var _floor = new MarketProductFloor({
                    link:$el.find('.floor_left a').attr('href'),
                    marketId: floorId,
                    name: $el.find('.floor_left title').text()
                  });
                  _floor.save(function(err, res) {
                    product($el, floorId, res._id);
                  })
                });
              }

              function product(el, marketId, floorId) {
                console.log('专业市场id' + marketId)
                console.log('楼层id' + floorId)
                var $products = $(el).find('.floor_r_left, .floor_r_right, .floor_bottom li');
                var products = [];
                $products.each(function(index, el) {
                  var $product = $(el);
                  var type;
                  var className = $(el).attr('class');
                  if (/floor_r_left/g.test(className)) {
                    type = '1';
                  } else if (/floor_r_right/g.test(className)) {
                    type = '2';
                  } else {
                    type = '3';
                  }
                  var id = null, link= $product.find('a').attr('href');
                  if(link && link.length > 10) {
                    id = link.substring(link.lastIndexOf('/') + 1, link.lastIndexOf('.'))
                  }

                  var _product = new MarketProduct({
                    img: $product.find('img').attr('src'),
                    link: $product.find('a').attr('href'),
                    id: id,
                    type: type,
                    marketId: marketId,
                    floorId:floorId,
                    appSortId: 999,
                    sortId:999
                  })
                  _product.save(function(err, res) {
                    if(err) return;
                    console.log( '产品 ->' +type + '--' + res.img);
                  })
                });
              }

            })
        }
      });
    })

  })





