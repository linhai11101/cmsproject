/*
*活动预告
*@time 2017/06/14
*/

var _ = require('underscore');

var ForecastIndex = require('../models/activityForecast/forecastIndex'),
	ForecastCate = require('../models/activityForecast/forecastCate'),
	Forecast = require('../models/activityForecast/forecast');

exports.getForecastIndex = function(req,res){

	ForecastIndex
	  .find()
	  .sort('sortId')
	  .exec(function(err,resObj){
	  	if (err) return res.json({status:0,msg:err});
	  	return res.json({status:1,data:resObj});
	  })
};
exports.saveForecastIndex = function(req,res){
	var id = req.body._id,
		FIObj = req.body,
		_FIObj;
	if (id) {
		ForecastIndex.update({_id:id},FIObj,function(err){
			if (err) return res.json({status:0,msg:err});
			return res.json({status:1});
		})
	}else{
		_FIObj = new ForecastIndex(FIObj);
		_FIObj.save(function(err,resObj){
			if (err) return res.json({status:0,msg:err});
			return res.json({status:1,data:resObj});
		})
	}
};
exports.delForecastIndex = function(req,res){
	var id = req.params.ids,
		idsArr = [];
	if (id) idsArr = id.split(',');
	if (idsArr.length) {
		ForecastIndex.remove({_id:{$in:idsArr}},function(err,delres){
			if (err) return res.json({status:0,msg:err});
			return res.json({status:1,data:delres});
		})
	};
};
exports.getForecastCate = function(req,res){
	var parentId = req.query.parentId;
	ForecastCate
	  .find({parentId:parentId})
	  .sort('sortId')
	  .exec(function(err,resObj){
	  	if (err) return res.json({status:0,msg:err});
	  	return res.json({status:1,data:resObj});
	  })
};
exports.saveForecastCate = function(req,res){
	var id = req.body._id,
		FCObj = req.body,
		_FCObj;
	if (id) {
		ForecastCate.update({_id:id},FCObj,function(err){
			if (err) return res.json({status:0,msg:err});
			return res.json({status:1})
		})
	}else{
		_FCObj = new ForecastCate(FCObj);
		_FCObj.save(function(err,resObj){
			if (err) return res.json({status:0,msg:err});
			return res.json({status:1,data:resObj});
		})
	};
};
exports.delForecastCate = function(req,res){
	var id = req.params.ids,
		idsArr = [];
	if (id) idsArr = id.split(',');
	if (idsArr.length) {
		ForecastCate.remove({_id:{$in:idsArr}},function(err,delres){
			if (err) return res.json({status:0,msg:err});
			return res.json({status:1,data:delres});
		})
	};
};
exports.getForecast = function(req,res){
	var parentId = req.query.parentId;
	Forecast
	  .find({parentId:parentId})
	  .sort('sortId')
	  .exec(function(err,resObj){
	  	if (err) return res.json({status:0,msg:err});
	  	return res.json({status:1,data:resObj});
	  })
};
exports.saveForecast = function(req,res){
	var id = req.body._id,
		FObj = req.body,
		_FObj;
	if (id) {
		Forecast.update({_id:id},FObj,function(err){
			if (err) return res.json({status:0,msg:err});
			return res.json({status:1})
		})
	}else{
		_FObj = new Forecast(FObj);
		_FObj.save(function(err,resObj){
			if (err) return res.json({status:0,msg:err});
			return res.json({status:1,data:resObj});
		})
	};
};
exports.delForecast = function(req,res){
	var id = req.params.ids,
		idsArr = [];
	if (id) idsArr = id.split(',');
	if (idsArr.length) {
		Forecast.remove({_id:{$in:idsArr}},function(err,delres){
			if (err) return res.json({status:0,msg:err});
			return res.json({status:1,data:delres});
		})
	};
};

