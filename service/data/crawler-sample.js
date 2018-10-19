var Superagent = require('superagent');
var Cheerio = require('cheerio');

var mongoose = require('mongoose');

var config = require('../config');
//链接数据库
var dbUrl = config.URL;
//var db = mongoose.connect(dbUrl);

//引入数据模型
var Ads = require('../models/ads');
var Product = require('../models/product');
var Sample = require('../models/sample');
var SampleProduct = require('../models/sampleProduct');


Superagent.get('http://www.mr-world.com/sampleCenter.cf')
  .end(function(err, res) {
    var resText = res.text;
    var $ = Cheerio.load(resText);

    //banner 数据
    var $banner = $('.banner-top');
    var banners = [];
    $banner.each(function(index, el) {
      var $el = $(el);
      var _ads = new Ads({
        img: $el.find('img').attr('src'),
        //link: $el.find('a').attr('href'),
        area: 2,
        sortid: 10
      })
      _ads.save(function(err, res) {
        if(err) return;
        console.log( 'banner ->' + res.img);
      })
    });

    //产品
    // var $promotion = $('.promotion .col-md-4');
    // $promotion.each(function(index, el) {
    //   var $el = $(el);
    //   var _product = new Product({
    //     img: $el.find('img').attr('data-src'),
    //     link: $el.find('a').attr('href'),
    //     area: 1,
    //     sortid: 10
    //   })
    //   _product.save(function(err, res) {
    //     if(err) return;
    //     console.log( 'banner ->' + res.title);
    //   })
    // });

    var $floors = $('.product-list-title');
    var $products = $('.product-list-area');
    // console.log($products[1])
    // return;

    $floors.each(function(index, el) {
      var $floor = $(el);
      var _floor = new Sample({
        name: $floor.find('.product-list-text').text()
      })
      _floor.save(function(err, res) {
        if(err) return;
        console.log($floor.find('.product-list-text').text() + '--楼层添加成功');
        product($products[index], res._id)
      })
    });

    function product(el, floorId) {
      var $products = $(el).find('.product-list-area-u');
      var products = [];
      $products.each(function(index, el) {
        var $product = $(el);
        var type;
        var _product = new SampleProduct({
          title: $product.find('.na').text(),
          price: $product.find('.pr .fi').text().replace('￥ ', ''),
          link: $product.find('a').attr('href'),
          img: $product.find('img').attr('src'),
          pid: floorId
        })
        _product.save(function(err, res) {
          if(err) return;
          console.log( ': 产品 ->' + res.img);
        })
      });
    }
  })


