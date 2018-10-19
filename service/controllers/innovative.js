var mongoose = require('mongoose');
var _ = require('underscore');
var Superagent = require('superagent');



var Innovative = require('../models/innovative');
var InnovativeBanner = require('../models/innovativeBanner');
var InnovativeProduct = require('../models/innovativeProduct');

var domainCrm = require('../config').java_api_host;
var getQuery = require('../util/getQuery');

function getRemoteZysc(callBack) {
    console.log("2225")
    if (!callBack) {
        callBack = function() {};
    }

    var url = domainCrm + "/cms/innoDesignProduct/industry.cf";
    Superagent.get(url)
        .end(function(err, res) {
            console.log(res);
            console.log(res.body.data);


            if (err) return callBack(err);
            // 清空原来的数据必须要清空原来的数据才能重新同步
            Innovative.remove(function(err, removeres) {
                if (err) {
                    return callBack(err);
                };
                console.log(removeres);
            });

            var count = 0,
                updateCount = 0;
            res.body.data.forEach(function(item, i) {
                Innovative.find()
                    .exec(function(err, resZysc) {

                        if (err) return callBack(err);
                        if (!resZysc.length) {
                            console.log(item);
                            var zyscObj = {
                                id: item.id, //专业镇ID
                                nameCn: item.nameCn,
                                nameEn: item.nameEn,
                                sortId: i + 1,
                                ishidden: 1
                            }
                            var _zysc = new Innovative(zyscObj);
                            _zysc.save(function(err, reszysc1) {
                                if (err) return callBack(err);
                                console.log(reszysc1);
                            })
                            updateCount++
                        }
                        count++;
                        _cb();
                    })
            })

            function _cb() {
                if (count == res.body.data.length) {
                    callBack(null, count, updateCount)
                }
            }

        })
}


exports.syncCate = function(req, res) {
    getRemoteZysc(function(err, count, updateCount) {
        if (err) {
            return res.json({ status: 0, msg: err })
        }
        res.json({ "status": 1, "count": count, "updateCount": updateCount })
    })
}

exports.getCate = function(req, res) {
    var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
    var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
    var startRow = (current - 1) * perPage;
    var sortName = req.query.shortName || 'sortId';
    var sortOrder = req.query.sortOrder;
    if (sortOrder === 'false') {
        sortName = '-' + sortName
    }

    var search = {};

    Innovative.find(search)
        .sort(sortName)
        .exec(function(err, market) {
            if (err) {
                return res.json({ 'status': 0, 'msg': err });
            }
            return Innovative.find(search).count(function(err, count) {
                return res.json({ 'status': 1, data: market, count: count })
            })
        })
}
//手机类目接口
exports.cate = function(req, res) {
    var sortName,query;
    query = getQuery(req,{sortName:""})
    sortName = query.shortName || 'sortId';
    Innovative.find({ ishidden: 1 })
        .sort(sortName)
        .exec(function(err, innovative) {
            if (err) {return res.json({ 'code': 1, 'msg': "获取创新类目失败" })};
            if (!innovative || innovative.length==0) {return res.json({ 'code': 0, data: []})}
            return res.json({ 'code': 0, data: innovative});
        })
}
// 获取创新设计产品
exports.innovativeAppProduct = function(req,res){
    var cateId,page,pageSize,startRow,search = {},query;
    query = getQuery(req,{page:"Number",pageSize:"Number",cateId:""});
    cateId = query.cateId;
    page = query.page > 0 ? query.page : 1;
    pageSize = query.pageSize > 0 ? query.pageSize : 10;
    startRow = (page-1)*pageSize;
    search.cateId = cateId;

    InnovativeProduct
        .find(search)
        .skip(startRow)
        .limit(pageSize)
        .exec(function(err, product) {
            if (err) {return res.json({code:1,msg:err})}
            InnovativeProduct.find(search).count(function(err,total){
                if (err) {return res.json({code:1,msg:err})}
                return res.json({code:0,data:product,page:page,pageSize:pageSize,total:total})
            })
        })
}

exports.shift = function(req, res) {
    var id = req.body._id;
    console.log(id)
    var marketObj = req.body;
    console.log(marketObj)
    var _cate;
    if (id) {
        Innovative.findById(id, function(err, market) {
            _cate = _.extend(market, marketObj);
            _cate.save(function(err, cate) {
                res.json({ status: 1 })
            })
        })
    } else {
        _cate = new Innovative(marketObj);
        _cate.save(function(err, market) {
            //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
            res.json({ status: 1, data: market })
        })
    }
}





exports.getBanner = function(req, res) {
    var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
    var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
    var startRow = (current - 1) * perPage;

    var search = {};

    InnovativeBanner.find(search)
        .skip(startRow)
        .limit(perPage)
        .exec(function(err, market) {
            if (err) {
                return res.json({ 'status': 0, 'msg': err });
            }
            return InnovativeBanner.find(search).count(function(err, count) {
                console.log(market);
                return res.json({ 'status': 1, data: market, count: count })

            })
        })
}
exports.saveBanner = function(req, res) {
    var id = req.body._id;
    console.log(id)
    var marketObj = req.body;
    console.log(req.body);
    var _cate;
    if (id) {
        InnovativeBanner.findById(id, function(err, market) {
            _cate = _.extend(market, marketObj);
            _cate.save(function(err, cate) {
                console.log(cate)
                res.json({ status: 1 })
            })
        })
    } else {
        _cate = new InnovativeBanner(marketObj);
        _cate.save(function(err, market) {
            //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
            console.log(market);
            res.json({ status: 1, data: market })
        })
    }
}

exports.delBanner = function(req, res) {
    var id = req.params.id;
    console.log(id);
    InnovativeBanner.remove({ _id: id }, function(err, market) {
        res.json({ status: 1 })
    })
}

exports.getProduct = function(req, res) {
    var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
    var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
    var startRow = (current - 1) * perPage;
    var sortName = req.query.shortName || 'sortId';
    var sortOrder = req.query.sortOrder;
    if (sortOrder === 'false') {
        sortName = '-' + sortName
    }

    var search = {};
    req.query.cateId && (search.cateId = req.query.cateId);
    console.log(req.query.cateId);

    InnovativeProduct.find(search)
        .sort(sortName)
        .skip(startRow)
        .limit(perPage)
        .exec(function(err, market) {
            if (err) {
                return res.json({ 'status': 0, 'msg': err });
            }
            return InnovativeProduct.find(search).count(function(err, count) {
                return res.json({ 'status': 1, data: market, count: count })
            })
        })
}
exports.saveProduct = function(req, res) {
    var id = req.body._id;
    //var _cateId = req.body.cateId;
    var marketObj = req.body;
    var _cate;
    // InnovativeProduct
    //     .find({cateId:_cateId,_id:id})
    //     .exec(function(err,prores){
    //         if (err) {console.log(err);}
    //         if (prores.length!=0) {
    //             return res.json({ status: 1, data:'该产品已存在。',flag:1})
    //         }
    //     })
    if (id) {
        InnovativeProduct.findById(id, function(err, market) {
            _cate = _.extend(market, marketObj);
            _cate.save(function(err, cate) {
                return res.json({ status: 1 })
            })
        })
    } else {
        _cate = new InnovativeProduct(marketObj);
        _cate.save(function(err, market) {
            return res.json({ status: 1, data: market })
        })
    }
}

exports.delProduct = function(req, res) {
    var id = req.params.id;
    console.log(id);
    InnovativeProduct.remove({ _id: id }, function(err, market) {
        res.json({ status: 1 })
    })
}
