var Superagent = require('superagent');
var mongoose = require('mongoose');

var Category = require('../models/category');
var config = require('../config');

//链接数据库
var dbUrl = config.URL;
//var db = mongoose.connect(dbUrl)


//console.log(Category);

var loginUrl = 'http://www.mr-world.com/user/login.cf';

var url = 'http://www.mr-world.com/category/findAllIndustries.cf';
// params industryId=10&parentId=0
var middleUrl = 'http://www.mr-world.com/category/findCategoriesByParams.cf';
//sessionid，
//todo 目前通过手动获取， 后期模拟登陆获取
//var cookie = 'JSESSIONID=AE725A27E688377DA073BFA1CB58CCD8;';

var user = {
  account: 'gjcgzx',
  password: '123456'
}

Superagent.post(loginUrl)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .send(user)
  .end(function(err, res){
    if (JSON.parse(res.text).code == 0) {

      var Cookie = res.header['set-cookie'][0];
      crawlerCate(Cookie)
    } else {
      console.log('登陆失败')
    }
  })

function crawlerCate(cookie) {
  console.log('===========start============')
  Superagent.get(url)
    .withCredentials()
    .set('Cookie', cookie)
    .end(function(err, res) {
      var da = JSON.parse(res.text).data;

      da.forEach(function(item, i){
        var _cate;
        var categoryObj = {
          name: item.name,
          link: '/catalogs/products/'+ splitName(item.name) + 'i' + item.id + '.html',
          parentid: '0'
        }
        _cate = new Category(categoryObj);
        _cate.save(function(err, category){
          console.log('一级', category)
          Superagent.get(middleUrl + '?industryId=' + item.id + '&parentId=0')
            .withCredentials()
            .set('Cookie', cookie)
            .end(function(err, res1) {
              var da1 = JSON.parse(res1.text).data;
              da1.forEach(function(item1){
                var _cate1;
                var categoryObj1 = {
                  name: item1.name,
                  link: '/catalogs/products/'+ splitName(item1.name)  +'c'+item1.id + '.html',
                  parentid: category._id
                }
                _cate1 = new Category(categoryObj1);
                _cate1.save(function(err, category1){
                  console.log('二级', category1)

                  Superagent.get(middleUrl + '?industryId=' + item1.industryId + '&parentId=' + item1.id)
                    .withCredentials()
                    .set('Cookie', cookie)
                    .end(function(err, res2) {
                      var da2 = JSON.parse(res2.text).data;
                      da2.forEach(function(item2){
                        var _cate2;
                        var categoryObj2 = {
                          name: item2.name,
                          link: '/catalogs/products/'+ splitName(item1.name)  +'c'+item1.id + '.html',
                          parentid: category1._id
                        }
                        _cate2 = new Category(categoryObj2);
                        _cate2.save(function(err, category2){
                          console.log('3级', category2)
                        })
                      })
                    })


                })
              })
            })

        })
      })
    })
}

function splitName(name) {
  if (!name) return;
  return name.toLowerCase().replace(/( *& *)|(, *)/g, ' ').replace(/ +/g, ' ').split(' ').join('-') + '-';
}

