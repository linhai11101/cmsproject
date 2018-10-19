var Superagent = require('superagent');
var Cheerio = require('cheerio');

var mongoose = require('mongoose');

var config = require('../config');
//链接数据库
var dbUrl = config.URL;
//var db = mongoose.connect(dbUrl);


//引入数据模型
var Ads = require('../models/ads');
var IndexFloor = require('../models/indexFloor');
var IndexProduct = require('../models/indexProduct');
var IndexLogo = require('../models/indexLogo');
var IndexLink = require('../models/indexLink');



Superagent.get('http://www.mr-world.com')
  .end(function(err, res) {
    var resText = res.text;
    var $ = Cheerio.load(resText);

    //banner 数据
    var $banner = $('#slides .slide');
    var banners = [];
    $banner.each(function(index, el) {
      var $el = $(el);
      var _ads = new Ads({
        img: $el.find('img').attr('src'),
        link: $el.find('a').attr('href'),
        area: 1,
        sortid: 10
      })
      _ads.save(function(err, res) {
        if(err) return;
        console.log( 'banner ->' + res.title);
      })
    });


    //楼层
    var $floor = $('.goods_sort')
    $floor.each(function(index, el){
      var $el = $(el);
      var title = $el.find('p').text().replace(/^\dF/, '');
      var _floor = new IndexFloor({name: title});
      _floor.save(function(err, res) {
        console.log( title + '--楼层添加成功');

        link(el, res._id);
        logo(el, res._id);
        product(el, res._id);
      })

    })


    function link(el, floorId) {
      var $links = $(el).find('.logoName a');
      var links = [];
      $links.each(function(index, el) {
        var $link = $(el);
        var _link = new IndexLink({
          title: $link.text(),
          link: $link.attr('href'),
          floorid: floorId
        });
        _link.save(function(err, res) {
          if(err) return;
          console.log( ': 链接 ->' + res.title);
        })
      });
    }

    function logo(el, floorId) {
      var $logos = $(el).find('.picList a');
      var logos = []
      $logos.each(function(index, el) {
        var $logo = $(el);
       // console.log('logo:', $logo)
        var _logo = new IndexLogo({
          title: '这是一个logo',
          //img: $logo.find('img').attr('data-src'),
          link: $logo.attr('href'),
          floorid: floorId
        });
        _logo.save(function(err, res) {
          console.log('logo',err)
          if(err) return;
          console.log( ': logo ->' + res.img);
        })
      });
    }


    function product(el, floorId) {
      var $products = $(el).find('.sortBanner, .goods');
      var products = [];
      $products.each(function(index, el) {
        var $product = $(el);
        var type;
        var className = $(el).attr('class');
        if (/sortBanner/g.test(className)) {
          type = 'a';
        } else if (/goods/g.test(className)) {
          type = 'b';
        }
        var _product = new IndexProduct({
          title: '莫个产品',
          img: $product.find('img').attr('data-original'),
          link: $product.find('a').attr('href'),
          type: type,
          floorid: floorId
        })
        _product.save(function(err, res) {
          if(err) return;
          console.log( ': 产品 ->' +type + '--' + res.img);
        })
      });
    }
  })
