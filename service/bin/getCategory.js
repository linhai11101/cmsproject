var Superagent = require('superagent');
var mongoose = require('mongoose');

var Category = require('../models/category');
var config = require('../config');

//链接数据库
var dbUrl = config.URL;
var db = mongoose.connect(dbUrl)


//console.log(Category);



var url = 'http://dev.gdp.com/category/findAllIndustries.cf';
// params industryId=10&parentId=0
var middleUrl = 'http://dev.gdp.com/category/findCategoriesByParams.cf';
//sessionid，
//todo 目前通过手动获取， 后期模拟登陆获取
var cookie = 'JSESSIONID=AE725A27E688377DA073BFA1CB58CCD8;';

Superagent.get(url)
  .withCredentials()
  .set('Cookie', cookie)
  .end(function(err, res) {

    //console.log(res.text)
    var da = JSON.parse(res.text).data;

    da.forEach(function(item, i){
      var _cate;
      var categoryObj = {
        name: item.nameCn,
        link: '/productSearch/list.cf?keyword=' + item.nameCn,
        parentid: '0'
      }
      _cate = new Category(categoryObj);
      _cate.save(function(err, category){
        //console.log(category)

        Superagent.get(middleUrl + '?industryId=' + item.id + '&parentId=0')
          .withCredentials()
          .set('Cookie', cookie)
          .end(function(err, res1) {

            console.log(res1.text)

            var da1 = JSON.parse(res1.text).data;
            da1.forEach(function(item1){
              var _cate1;
              var categoryObj1 = {
                name: item1.nameCn,
                link: '/productSearch/list.cf?keyword=' + item.nameCn,
                parentid: category._id
              }
              _cate1 = new Category(categoryObj1);
              _cate1.save(function(err, category1){
                //console.log(category1)

                Superagent.get(middleUrl + '?industryId=' + item1.industryId + '&parentId=' + item1.id)
                  .withCredentials()
                  .set('Cookie', cookie)
                  .end(function(err, res2) {
                    var da2 = JSON.parse(res2.text).data;
                    da2.forEach(function(item2){
                      var _cate2;
                      var categoryObj2 = {
                        name: item2.nameCn,
                        link: '/productSearch/list.cf?keyword=' + item.nameCn,
                        parentid: category1._id
                      }
                      _cate2 = new Category(categoryObj2);
                      _cate2.save(function(err, category2){
                        //console.log(category2)
                      })
                    })
                  })


              })
            })
          })

      })
    })
  })



