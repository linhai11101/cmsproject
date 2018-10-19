/*
*电子杂志
*@time 2017/05/09
*/ 
var mongoose = require('mongoose');
var _ = require('underscore');
var eventproxy = require('eventproxy');
// 模型
var recommendModel = require('../models/ezine/recommend');
var categoryModel = require('../models/ezine/category');
var industrialModel = require('../models/ezine/industrial');
var componyModel = require('../models/ezine/compony');

var redis = require('../util/redis');
var toTreeData = require('../util/tree').toTreeData;
var getQuery = require('../util/getQuery');

// 推荐
exports.getRecommend = function(req,res){
	recommendModel
		.find()
		.sort('sortId')
		.exec(function(err,recommend){
			if (err) {console.log(err);res.json({'status':0,'msg':err});return;};
			res.json({'status':1,'data':recommend});
		})
};
exports.saveRecommend = function(req,res){
	var id = req.body._id;
	var recommendObj = req.body;
	if (id) {
		recommendModel.update({_id:id},recommendObj,function(err){
			if (err) {console.log(err);res.json({'status':0});return;};
			res.json({'status':1})
		})
	}else{
		var _recommendObj = new recommendModel(recommendObj);
		_recommendObj.save(function(err,resObj){
			if (err) {console.log(err);res.json({'status':0});return;};
			res.json({'status':1,'data':resObj});
		})
	}
};
exports.delRecommend = function(req,res){
	var id = req.params.ids;
	var idsArr = [];
	if (id) {idsArr = id.split(',')}
	if (idsArr.length) {
		recommendModel.remove({_id:{$in: idsArr}}, function(err,delres){
			if (err) {res.json({'status':0,'msg':err});return;}
			res.json({'status':1})
		});
	}
};
// 类目
exports.saveCategory = function(req,res){
	var id = req.body._id;
	var categoryObj = req.body;
	if (id) {
		categoryModel.update({_id:id},categoryObj,function(err){
			if (err) {console.log(err);res.json({'status':0});return;};
			res.json({'status':1})
		})
	}else{
		var _categoryObj = new categoryModel(categoryObj);
		_categoryObj.save(function(err,resObj){
			if (err) {console.log(err);res.json({'status':0});return;}
			res.json({'status':1,'data':resObj});
		})
	}
};
exports.getCategory = function(req,res){
	categoryModel
		.find()
		.sort('sortId')
		.exec(function(err,cate){
			if (err) {console.log(err);res.json({'status':0});return;}
			res.json({'status':1,'data':cate});
		})
};
exports.delCategory = function(req,res){
	var ids = req.params.ids;
	var idsArr = [];
	if (ids) {idsArr = ids.split(',')};
	if (idsArr.length) {
		categoryModel.remove({_id:{$in:idsArr}},function(err,delres){
			if (err) {res.json({'status':0,'msg':err});return;}
			res.json({'status':1});
		})
	}
};
// 产业集群
exports.saveIndustrial = function(req,res){
	var id = req.body._id;
	var industrialObj = req.body;
	if (id) {
		industrialModel.update({_id:id},industrialObj,function(err){
			if (err) {console.log(err);res.json({'status':0});return;};
			res.json({'status':1})
		})
	}else{
		var _industrialObj = new industrialModel(industrialObj);
		_industrialObj.save(function(err,resObj){
			if (err) {console.log(err);res.json({'status':0});return;}
			res.json({'status':1,'data':resObj});
		})
	}
};
exports.getIndustrial = function(req,res){
	var type = req.query.clusterType?req.query.clusterType:1;
	var search = {clusterType:type}
	industrialModel
		.find(search)
		.sort('sortId')
		.exec(function(err,cate){
			if (err) {console.log(err);res.json({'status':0});return;}
			res.json({'status':1,'data':cate});
		})
};
exports.delIndustrial = function(req,res){
	var ids = req.params.ids;
	var idsArr = [];
	if (ids) {idsArr = ids.split(',')};
	if (idsArr.length) {
		industrialModel.remove({_id:{$in:idsArr}},function(err,delres){
			if (err) {res.json({'status':0,'msg':err});return;}
			res.json({'status':1});
		})
	}
};
// 企业
exports.saveCompony = function(req,res){
	var id = req.body._id;
	var componyObj = req.body;
	if (id) {
		componyModel.update({_id:id},componyObj,function(err){
			if (err) {console.log(err);res.json({'status':0});return;};
			res.json({'status':1})
		})
	}else{
		var _componyObj = new componyModel(componyObj);
		_componyObj.save(function(err,resObj){
			if (err) {console.log(err);res.json({'status':0});return;}
			res.json({'status':1,'data':resObj});
		})
	}
};
exports.getCompony = function(req,res){
	componyModel
		.find()
		.sort('sortId')
		.exec(function(err,cate){
			if (err) {console.log(err);res.json({'status':0});return;}
			res.json({'status':1,'data':cate});
		})
};
exports.delCompony = function(req,res){
	var ids = req.params.ids;
	var idsArr = [];
	if (ids) {idsArr = ids.split(',')};
	if (idsArr.length) {
		componyModel.remove({_id:{$in:idsArr}},function(err,delres){
			if (err) {res.json({'status':0,'msg':err});return;}
			res.json({'status':1});
		})
	}
};
exports.getwebcompony = function(req,res){
	var page = ~~req.query.page > 0 ? ~~req.query.page : 1,
		pageSize = ~~req.query.pageSize > 0 ? ~~req.query.pageSize : 12,
		startRow = (page-1)*pageSize,
		parentid = req.query.parentid,
		search = {parentid:parentid},
		clusterType = req.query.clusterType;
		if(clusterType)search.clusterType = clusterType;
		req.query.provinceId ? (search.provinceId = ~~req.query.provinceId):null;
		req.query.districtId ? (search.districtId = ~~req.query.districtId):null;
	componyModel
		.find(search)
		.skip(startRow)
		.limit(pageSize)
		.sort('sortId')
		.exec(function(err,resobj){
			if (err) res.json({'code':1,'msg':err});
			componyModel.find(search).count(function(err,count){
				if (err) res.json({'code':1,'msg':err});
				res.json({'code':0,'data':resobj,'page':page,'pageSize':pageSize,'maxPage':Math.ceil(count/pageSize),'count':count})
			})
		})

};
exports.getwebindustrial = function(req,res){
	var page = ~~req.query.page > 0 ? ~~req.query.page : 1,
		pageSize = ~~req.query.pageSize > 0 ? ~~req.query.pageSize : 12,
		startRow = (page-1)*pageSize,
		clusterType = req.query.clusterType,
		search = {clusterType:clusterType};
		if(!clusterType)search = {};
		req.query.provinceId ? (search.provinceId = ~~req.query.provinceId):null;
		req.query.districtId ? (search.districtId = ~~req.query.districtId):null;
	industrialModel
		.find(search)
		.skip(startRow)
		.limit(pageSize)
		.sort('sortId')
		.exec(function(err,resobj){
			if (err) res.json({'code':1,'msg':err});
			industrialModel.find(search).count(function(err,count){
				if (err) res.json({'code':1,'msg':err});
				res.json({'code':0,'data':resobj,'page':page,'pageSize':pageSize,'maxPage':Math.ceil(count/pageSize),'count':count})
			})
		})

};
exports.getwebcomponydistrict = function(req,res){
	var parentid = req.query.parentid || null,
		search = {};
	if(!parentid)return res.json({code:1,msg:"parentid is empty"});
	search.parentid = parentid;
	componyModel
		.find(search)
		.exec(function(err,resCOMdistrict){
			if (err) res.json({'code':1,'msg':err});
			var _arr = JSON.parse(JSON.stringify(resCOMdistrict)),
				hasPStr = "",
				hasCStr = "",
				targetArr = [];
			_arr.forEach(function(item,index){
				if(hasPStr.indexOf(item.province)==-1){
					hasPStr+=item.province;
					targetArr.push({name:item.province,id:item.provinceId,city:[{name:item.district,id:item.districtId}]});
					hasCStr+=item.district;
				}else{
					targetArr.forEach(function(a,idx){
						if((a.id == item.provinceId) && (hasCStr.indexOf(item.district)==-1)){
							hasCStr+=item.district;
							a.city.push({name:item.district,id:item.districtId});
						}
					})
				}
				if (index == _arr.length-1) {return res.json({code:0,data:targetArr})};
			})
		})
}
exports.getwebindustrialdistrict = function(req,res){
	industrialModel
		.find()
		.exec(function(err,resCLUdistrict){
			if (err) res.json({'code':1,'msg':err});
			var _arr = JSON.parse(JSON.stringify(resCLUdistrict)),
				hasPStr = "",
				hasCStr = "",
				targetArr = [];
			_arr.forEach(function(item,index){
				if(hasPStr.indexOf(item.province)==-1){
					hasPStr+=item.province;
					targetArr.push({name:item.province,id:item.provinceId,city:[{name:item.district,id:item.districtId}]});
					hasCStr+=item.district;
				}else{
					targetArr.forEach(function(a,idx){
						if((a.id == item.provinceId) && (hasCStr.indexOf(item.district)==-1)){
							hasCStr+=item.district;
							a.city.push({name:item.district,id:item.districtId});
						}
					})
				}
				if (index == _arr.length-1) {return res.json({code:0,data:targetArr})};
			})
		})
}
exports.getwebcategory = function(req,res){
	var parentid = req.query.parentid || null,
		search = {parentid:parentid};
		if (!parentid) {search={}};
		search.isCate=false
	categoryModel
		.find(search)
		.sort('sortId')
		.exec(function(err,resobj){
			if (err) res.json({'code':1,'msg':err});
			res.json({'code':0,'data':resobj})
		})

};
// 设置缓存
exports.setCateCache = function(req,res){
	categoryModel
		.find({isHidden:1})
		.sort('sortId')
		.exec(function(err,cate){
			if (err) {res.json({'status':0});return;}
			cate = JSON.parse(JSON.stringify(cate));
			var x = toTreeData(cate,0)
			x = JSON.stringify(x);
			redis.set('ezcategory',x,function(err){
				res.json({'status':1});
			})
		})
}
// APP
exports.getAppEZCate = function(req,res){
	var categories,clusters,companies;
	recommendModel
		.find({area:11})
		.limit(3)
		.sort("sortId")
		.exec(function(err,categoriesRes){
			if (err) {res.json({'code':1,msg:'can not find categories'});return;}
			categories = categoriesRes?categoriesRes:[]
			recommendModel
				.find({area:12})
				.limit(3)
				.sort("sortId")
				.exec(function(err,clustersRes){
					if (err) {res.json({'code':1,msg:'can not find clusters'});return;}
					clusters = clustersRes?clustersRes:[]
					recommendModel
						.find({area:13})
						.limit(3)
						.sort("sortId")
						.exec(function(err,companiesRes){
							if (err) {res.json({'code':1,msg:'can not find companies'});return;}
							companies = companiesRes?companiesRes:[]
							return res.json({'code':0,data:{categories:categories,clusters:clusters,companies:companies}})
						})
				})
		})
}
exports.getAppCategory = function(req,res){
	
	categoryModel
		.find()
		.sort("sortId")
		.exec(function(err,cateRes){
			if (err) {res.json({'code':1,msg:err});return;}
			var _cateRes = JSON.parse(JSON.stringify(cateRes));
			var _data = toTreeData(_cateRes,0);
			return res.json({code:0,data:_data});
		})
}
exports.getAppIndustrial = function(req,res){
	var _type,query,serach = {};
	query = getQuery(req,{clusterType:""})
	_type = query.clusterType?query.clusterType:null;
	if(_type){serach.clusterType = _type}

	industrialModel
		.find(serach)
		.sort("sortId")
		.exec(function(err,industrialsRes){
			if (err) {res.json({'code':1,msg:err});return;}
			return res.json({code:0,data:industrialsRes})
		})
}
exports.getAppCompanyCate = function(req,res){
	var allEZ,vip,latest;
	componyModel
		.find({isCate:false})
		.sort("sortId")
		.exec(function(err,companyAll){
			if (err) {res.json({'code':1,msg:err});return;}
			allEZ = companyAll?companyAll:[];
			recommendModel
				.find({area:14})
				.sort("sortId")
				.exec(function(err,vipRes){
					if (err) {res.json({'code':1,msg:err});return;}
					vip = vipRes?vipRes:[];
					recommendModel
						.find({area:15})
						.sort("sortId")
						.exec(function(err,latestRes){
							if (err) {res.json({'code':1,msg:err});return;}
							latest = latestRes?latestRes:[];
							return res.json({code:0,data:{allcompany:allEZ,vip:vip,latest:latest}})
						})
				})
		})
}
exports.getAppCompanyAll = function(req,res){
	var page,pageSize,startRow,search = {},query;
	query = getQuery(req,{page:"Number",pageSize:"Number"});
	page = query.page>0?query.page : 1;
	pageSize = query.pageSize>0?query.pageSize : 10;
	startRow = (page-1)*pageSize;
	search.isCate = false;
	componyModel
		.find(search)
		.skip(startRow)
		.limit(pageSize)
		.sort("sortId")
		.exec(function(err,companyAll){
			if (err) {res.json({'code':1,msg:err});return;}
			componyModel.find().count(function(err,count){
				return res.json({code:0,data:{items:companyAll,page:page,pageSize:pageSize,total:count,maxPage:Math.ceil(count/pageSize)},msg:""});
			})
		})
}
exports.getAppCompanyTheLast = function(req,res){

	var latest;
	recommendModel
		.find({area:15})
		.sort("sortId")
		.exec(function(err,latestRes){
			if (err) {res.json({'code':1,msg:err});return;}
			latest = latestRes?latestRes:[];
			return res.json({code:0,data:latest})
		})
}

// 转化为树形结构
function toTreeData(data,pid){
    var result = [] , temp;
    for(var i in data){
        if(data[i].parentid==pid){
            result.push(data[i]);
            data[i].children = [];
            temp = toTreeData(data,data[i]._id);
            if(temp.length>0){
                data[i].children=temp;
            }
        }
    }
    return result;
}





