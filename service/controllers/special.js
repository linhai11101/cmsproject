/**
 * 广贸基地
 * @time 2016/4/21
 */

var mongoose = require('mongoose');
var _ = require('underscore');
var Superagent = require('superagent');


//模型
var SpecialBanner = require('../models/specialBanner');
var SpecialCate = require('../models/specialCate');
var SpecialProduct = require('../models/specialProduct');

var agent = require('../config').java_api_host;
var getQuery = require('../util/getQuery');

//获取基地
exports.getAllBanner = function(req, res) {
        var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
        var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
        var startRow = (current - 1) * perPage;
        var sortName = req.query.shortName || 'sortId';
        var sortOrder = req.query.sortOrder;
        if (sortOrder === 'false') {
            sortName = '-' + sortName
        }

        SpecialBanner.find()
            .skip(startRow)
            .limit(perPage)
            .sort(sortName)
            .exec(function(err, special) {
                if (err) {
                    return res.json({ 'status': 0, 'msg': err });
                }
                return SpecialBanner.count(function(err, count) {
                    res.json({ 'status': 1, data: special, count: count })
                })
            })
    }
    //获取一条类目


//添加类目
exports.saveBanner = function(req, res) {
    console.log(req);
    var id = req.body._id;
    var specialObj = req.body;
    console.log(specialObj);
    var _special;
    if (id) {
        console.log("1111");
        SpecialBanner.findById(id, function(err, special) {
            _special = _.extend(special, specialObj);
            _special.save(function(err, special) {
                res.json({ status: 1 })
            })
        })
    } else {
        console.log("222;");
        _special = new SpecialBanner(specialObj);
        _special.save(function(err, special) {
            //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
            console.log(special);
            res.json({ status: 1, data: special })


        })
    }
}




//支持删除
exports.delBanner = function(req, res) {
    var ids = req.params.ids;
    var idsArr = [];
    if (ids) {
        idsArr = ids.split(',')
    }

    if (idsArr.length) {
        SpecialBanner.remove({ _id: { $in: idsArr } }, function(err, banner) {
            if (err) {
                res.json({ 'status': 0, 'msg': err })
                return
            }
            res.json({ 'status': 1 })
        });
    }
}





//获取楼层
exports.getCate = function(req, res) {
    var dataTime = Date.now();//new Date().getTime()
    console.log(dataTime); 
    SpecialCate
        .find({})
        .sort('sortId')
        .exec(function(err, specialCate) {
            if (err) {
                return res.json({ 'status': 0, 'msg': err });
            }
            return SpecialCate.find({}).count(function(err, count) {
                return res.json({ 'status': 1, data: specialCate, count: count,time:dataTime })
            })
        });
}
exports.getAppCate = function(req, res) {
        var _specialCate = [];
       
        SpecialCate
            .find({})
            .sort('sortId')
            .exec(function(err, specialCate) {
                if (err) {
                    return res.json({ 'code': 1, 'msg': '获取促销类目失败' });
                }
                return SpecialCate.find({}).count(function(err, count) {
                    var count = 0;
                    var length = specialCate.length;
                    for (var i = 0; i < specialCate.length; i++) {
                        var fn = function(i) {
                            SpecialProduct
                                .find({ 'cateId': specialCate[i]._id, 'isTop': 1 })
                                .exec(function(err, product) {

                                    if (product.length == 0) {
                                        specialCate.pop(specialCate[i])
                                    }
                                    console.log(specialCate)
                                    count++;
                                    if (count == length) {
                                        return res.json({ 'code': 0, data: specialCate, count: specialCate.length })
                                    }
                                })
                        }(i);

                    }


                })
            });
    }
    //添加楼层
exports.saveCate = function(req, res) {
        var id = req.body._id
        var cateObj = req.body
        var _cate;

        if (id) {
            SpecialCate.findById(id, function(err, cate) {
                _cate = _.extend(cate, cateObj)
                _cate.save(function(err, cate) {
                    res.json({ status: 1 })
                });
            })
        } else {
            _cate = new SpecialCate(cateObj);
            _cate.save(function(err, cate) {
                res.json({ status: 1, data: { _id: cate._id } })
            })
        }
    }
    //删除楼层
exports.delCate = function(req, res) {
    var id = req.params.id;
    if (id) {
        SpecialCate.remove({ _id: id }, function(err, cate) {
            if (err) {
                res.json({ status: 0, message: err })
            } else {
                res.json({ status: 1 })
            }
        })
    }
}

//同步产品
exports.syncProduct = function(req, res) {
    // var pid = req.params.id;
    var id = req.body.id;
    getSpecialProduct(id, function(err, count, updateCount) {
        if (err) {
            return res.json({ status: 0, msg: err })
        }
        res.json({ status: 1, count: count, updateCount: updateCount })
    })
}



//同步过期产品
exports.syncOverdueProducts = function(req, res) {
     var time = req.params.time;
    

    getOverdueProducts(time,function(err, count, updateCount) {
        if (err) {
            return res.json({ status: 0, msg: err })
        }
        res.json({ status: 1, count: count, updateCount: updateCount })
    })
}



//获取商品
function getSpecialProduct(id, callBack) {
    if (!callBack) {
        callBack = function() {};
    }
    var url = agent + '/product/productAndPromotion.cf?productId=' + id; //agent
    Superagent.get(url)
        .end(function(err, res) {
            console.log(err);
            if (err) return callBack(err);
            var productObj = JSON.parse(res.text)
            if (0 != productObj.code || !(productObj.data && productObj.data.length)) {
                return callBack(null, 0, 0)
            }

            _product = new SpecialProduct(productObj);
            _product.save(function(err, product) {
                res.json({ status: 1, data: { _id: product._id } })
            })

        })
}


//获取过期商品
function getOverdueProducts(time,callBack) {
    var oldProducts;
    if (!callBack) {
        callBack = function() {};
    }
    var url = agent + '/scheme/getDueAndTerminateId.cf'; //agent
    Superagent.get(url)
        .end(function(err, res) {
            console.log(err);
            if (err) return callBack(err);
            var dueIds = JSON.parse(res.text);
             console.log(res);
            if (0 != dueIds.code || !(dueIds.data)) {
                  console.log(dueIds.data);
                 
                return callBack(null, 0, 0)
            }

            console.log(dueIds);
            
            SpecialProduct
                     .find()
                     .sort('sortId')
                     .exec(function(err, product) {
                        if (err) {
                            return res.json({ 'status': 0, 'msg': err });
                        }

                        oldProducts = product;
                          console.log(dueIds.data.due);
                           console.log(oldProducts);
                        for(var i=0;i<dueIds.data.due.length;i++){
                           for(var j=0;j<oldProducts.length;j++){
                             if(dueIds.data.due[i]==oldProducts[j].promotionId){
                                 
                                    oldProducts[j].endTime=time;

                                    oldProducts[j].save(function(err, product) {
                                         res.json({ status: 1, data: { _id: product._id } })
                                    });
                             }else{


                                return callBack(null, 0, 0)


                             }


                           }
                         
                        }
                        
                       
                    });

          
             
          

        })
}


//添加产品
exports.saveProduct = function(req, res) {
        var id = req.body._id
        var productObj = req.body
        var _product;

        if (id) {
            SpecialProduct.findById(id, function(err, product) {
                _product = _.extend(product, productObj)
                _product.save(function(err, product) {
                    res.json({ status: 1 })
                });
            })
        } else {
            _product = new SpecialProduct(productObj);
            _product.save(function(err, product) {
                res.json({ status: 1, data: { _id: product._id } })
            })
        }
    }
    //获取产品
exports.getProduct = function(req, res) {
        var id = req.params.id;
        SpecialProduct
            .find({ 'cateId': id })
            .sort('sortId')
            .exec(function(err, product) {
                if (err) {
                    return res.json({ 'status': 0, 'msg': err });
                }
                return SpecialProduct.find({ 'cateId': id }).count(function(err, count) {
                    return res.json({ 'status': 1, 'items': product, count: count })
                })
            });
    }
    //获取产品
exports.getAppProduct = function(req, res) {
        var id = req.params.id;
        var search = { 'cateId': id, 'isTop': 1 },targetProducts = [];
        SpecialProduct
            .find(search)
            .sort('sortId')
            .exec(function(err, product) {
                if (err) return res.json({ 'code': 1, 'msg': '获取促销商品失败' });
                var _len = product.length;
                if (!_len || _len==0) return res.json({ 'code': 0, data: [] });
                for (var i = 0; i < product.length; i++) {
                    var nowTime,endTime,_remainTime;
                    nowTime = Date.parse(new Date()) / 1000;
                    endTime = Date.parse(new Date(product[i].endTime)) / 1000;
                    _remainTime = endTime - nowTime;
                    if (_remainTime>0) {
                        product[i].remainTime = _remainTime;

                        targetProducts.push(product[i]);
                    }
                    if (_len==i+1) return res.json({ 'code': 0, data: targetProducts});
                }
            });
    }
    //删除产品
exports.delProduct = function(req, res) {
    var id = req.params.id;
    if (id) {
        SpecialProduct.remove({ _id: id }, function(err, product) {
            if (err) {
                res.json({ status: 0, message: err })
            } else {
                res.json({ status: 1 })
            }
        })
    }
}
