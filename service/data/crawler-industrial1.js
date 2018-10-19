var Superagent = require('superagent');
var Cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var _ = require('underscore');

var mongoose = require('mongoose');

var config = require('../config');
//链接数据库
var dbUrl = config.URL;
var db = mongoose.connect(dbUrl);

var Ads = require('../models/ads');
var Product = require('../models/product');
var Industrial = require('../models/industrial');
var IndustrialMenu = require('../models/industrialMenu');
var IndustrialShop = require('../models/industrialShop');

var ep = new eventproxy();

Superagent.get('http://sit.gdp8.com/industrial/industrialCluster.cf')
  .end(function(err, res) {
    var resText = res.text;
    var $ = Cheerio.load(resText);


    var $products = $('.box li');
    var i = 0
    $products.each(function(index, el) {
      var $product = $(el);

      if ('#' == $product.find('a').attr('href')) {
        console.log(index);
        i++;
        //ep.emit('industrial', ['asdfasdfasd', 'sss'])
        console.log('假的');
        return
      }
      var type;
      var _product = new Industrial({
        name: index,
        img: $product.find('img').attr('src'),
      })
      //_product.save(function(err, res) {
        //if(err) return;
        //console.log( '专业镇 ->' + res.img);
        ep.emit('industrial', [$product.find('a').attr('href'), res._id])
      //})
    });

    ep.after('industrial', $products.length - i, function(res) {
      res.forEach(function(el, index) {
        if(el[0] != '#') {
          var id = el[1];
          Superagent.get(el[0])
            .end(function(err, res) {
              var resText = res.text;
              var $ = Cheerio.load(resText);

              var $contains = $('.cont-box');

              Industrial.findById(id, function(err, industrial){
                _industrial = _.extend(industrial, {logo: $('.logo img').eq(1).attr('src')})
                _industrial.save(function(err, ads) {
                  console.log('专业镇: logo')
                });
              })

              //menu($contains, id);
              //banner($contains.find('.picList li'), id);
              //tuij($contains.find('.ri > a'), id)
              product($contains.find('.box-item1'), id)

              function menu($el, floorId){
                var $menu1 = $el.find('.me > div');
                $menu1.each(function(index, el) {
                  var $menu = $(el);
                  var _menu = new IndustrialMenu({
                    name: $menu.find('.ti').text(),
                    industrialId: floorId,
                    parentid: floorId
                  })
                  _menu.save(function(err, res){
                    if(err) return;
                    $menu.find('a').each(function(index, el) {
                      var $el = $(el);
                      var _menu2 = new IndustrialMenu({
                        name: $el.text(),
                        industrialId: floorId,
                        parentid: res._id,
                        link: $el.attr('href')
                      })
                      _menu2.save(function(err, res){
                        if(err) return;
                        console.log('专业镇: 菜单->'+ $el.text())
                      })
                    });
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
                    console.log( '专业镇: banner ->' + res.img);
                  })
                });
              }

              function tuij($tuij, floorId){
                $tuij.each(function(index, el) {
                  if(index > 1) return;
                  var $el = $(el);
                  var _product = new Product({
                    name: $el.find('.te1').text(),
                    link: $el.find('a').attr('href'),
                    desc: $el.find('.te2').text(),
                    price: $el.find('.te3').text().replace('￥ ', ''),
                    area: floorId
                  })
                  _product.save(function(err, res) {
                    if(err) return;
                    console.log( '专业镇: 推荐 ->' + res.name);
                  })
                });
              }


              function product($el, floorId) {
                $el.each(function(index, el) {
                  var $product = $(el);
                  var type;
                  var className = $(el).attr('class');

                  IndustrialShop.find({img:$product.find('img').attr('src')}, function(err, ads){
                    _ads = _.extend(ads, {id: $product.find('a').attr})
                    _ads.save(function(err, ads) {
                      res.json({status:1})
                    });
                  })

                  var _product = new IndustrialShop({
                    img: $product.find('img').attr('src'),
                    link: $product.find('a').attr('href'),
                    pId: floorId,
                    categoryId:0
                  })
                  _product.save(function(err, res) {
                    if(err) return;
                    console.log( '专业镇: 商家 ->' +type + '--' + res.img);
                  })
                });
              }

            })
        }
      });
    })

  })





