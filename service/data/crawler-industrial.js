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
var Industrial = require('../models/industrial');
var IndustrialMenu = require('../models/industrialMenu');
var IndustrialShop = require('../models/industrialShop');

var ep = new eventproxy();

Superagent.get('http://www.mr-world.com/industrial/industrialCluster.cf')
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
        appSortId:999,
        sortId:999,
      })
      _product.save(function(err, res) {
        if(err) return;
        console.log( '专业镇 ->' + res.img);
        ep.emit('industrial', [$product.find('a').attr('href'), res._id])
      })
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
                _industrial = _.extend(industrial, {logo: $('.logo img').attr('src')})
                _industrial.save(function(err, ads) {
                  console.log('专业镇: logo')
                });
              })

              menu($contains, id);
              banner($contains.find('.picList li'), id);
              tuij($contains.find('.assigned-bar > li'), id)
              product($contains.find('.box-item1'), id)

              function menu($el, floorId){
                var $menu1 = $el.find('.zyzhenglist > li');
                $menu1.each(function(index, el) {
                  var $menu = $(el);
                  var _menu = new IndustrialMenu({
                    name: $menu.text().trim(),
                    link: $menu.find('a').attr('href'),
                    industrialId: floorId,
                    parentid: floorId
                  })
                  _menu.save(function(err, res){
                    if(err) return;
                    console.log('菜单-》', $menu.text())
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
                    name: '专业镇推荐',
                    link: $el.find('a').attr('href'),
                    img: $el.find('img').attr('src'),
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

                  var id = null, link= $product.find('a').attr('href');
                  if(link && link.length > 10) {
                    id = link.trim().split('companyId=')[1];
                    //id = link.substring(link.lastIndexOf('/') + 1, link.lastIndexOf('.'))
                  }

                  var _product = new IndustrialShop({
                    img: $product.find('img').attr('src'),
                    link: $product.find('a').attr('href'),
                    id: id,
                    pId: floorId,
                    categoryId:0,
                    appSortId:999,
                    sortId:999,
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





