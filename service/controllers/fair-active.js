/*
*展贸活动
*@time 2017/10/11
*/

var mongoose = require("mongoose");
var _ = require("underscore");
var superagent = require("superagent");

// 模型
var fairActive = require("../models/fair-active");
var ads = require("../models/ads");

var domainCrm = require('../config').java_api_host;

exports.syncFairActive = function(req,res){
	var id = req.body._id;
	var actObj = req.body;
	var _act;
	if (id) {
	  fairActive.findById(id,function(err,act){
	    if (err) return res.json({status:0,msg:err});

	    _act = _.extend(act,actObj);

	    _act.save(function(err,actRes){
	      if (err) return res.json({status:0,msg:err});

	      res.json({status:1,data:actRes});
	    })
	  })
	}else{
	   getRemoteFairAct(function(err, count, updateCount,newCount){

	    if (err) return res.json({status: 0,msg:err});

	    res.json({"status":1, "count": count, "updateCount": updateCount,"newCount":newCount})

	  })
	}
}
function getRemoteFairAct (callback) {
	if (!callback) callback = function(){};

	var url = domainCrm + "/cms/activitys/getAllExhibitionTradeActivity.cf";

	superagent.post(url)
		.end(function(err,res){
			if (err) return callback(err);

			var data_res = res.body.data;
			
			var updateCount = 0,count = 0,newCount = 0;
			
			data_res.forEach(function(item,index){

				var m = {};

				fairActive.find({id:item.id}).exec(function(err,resact){
					if (err) return callback(err);
					
					if (resact.length && !!resact[0]) {

						var resact_obj = JSON.parse(JSON.stringify(resact[0]))
						
						if (!resact_obj.iwId || !resact_obj.industryId) {
							resact_obj.iwId = 0;
							resact_obj.industryId = 0;
						}
						if (item.activitiesStatus != 1) item.activitiesStatus = 0;

						_.extend(m,item,resact_obj);
						
						m = JSON.parse(JSON.stringify(m));
						
						fairActive.update({_id:m._id},m,function(err){
							if (err) return callback(err);
						})

						updateCount++;

					}else{
						if (!item.iwId || !item.industryId) {
							item.iwId = 0;
							item.industryId = 0;
						}
						if (item.activitiesStatus != 1) item.activitiesStatus = 0;//这里直接设置活动状态0为past活动；

						m = new fairActive(item);

						m.save(function(err,resm){
							if (err) return callback(err);
						})

						newCount++;
					}

					count++;
					
					if (count == data_res.length) {
						callback(null,count,updateCount,newCount);
					}
				})
			})

		})

}
// 获取展贸活动
exports.getFairAct = function (req,res){
	var iwId,search,page,pageSize,startRow;

	iwId = req.query.iwId;
	page = ~~req.query.page>0 ? ~~req.query.page:1;
	pageSize = ~~req.query.pageSize>0 ? ~~req.query.pageSize:5;
	startRow = (page-1)*pageSize;

	search = {iwId:iwId};

	fairActive
		.find(search)
		.skip(startRow)
		.limit(pageSize)
		.sort("sortId")
		.exec(function(err,findres){
			if (err) return res.json({status:0,msg:err});
			fairActive.find(search).count(function(err,count){
				if (err) return res.json({status:0,msg:err});
				return res.json({status:1,data:findres,page:page,pageSize:pageSize,total:count,maxPage:Math.ceil(count/pageSize)});
			})
		})
}


// app接口
exports.getAPPFairAct = function(req,res){
	var page,pageSize,startRow,iwId,industryId,search,activitiesStatus;

	page = ~~req.body.page > 0? ~~req.body.page:1;
	pageSize = ~~req.body.pageSize > 0?~~req.body.pageSize:5;
	iwId = req.body.iwId;
	industryId = req.body.industryId;
	activitiesStatus = (req.body.status==0)?req.body.status:1;
	search = {activitiesStatus:activitiesStatus};
	startRow = (page-1)*pageSize;

	if (!!iwId) search.iwId = iwId;
	if (!!industryId) search.industryId = industryId;

	fairActive
		.find()
		.exec(function(err,resi){
			if (err) return res.json({code:1,data:err,msg:"get category error."});

			var cateNav = treeCategory(resi);

			fairActive
				.find(search)
				.skip(startRow)
				.limit(pageSize)
				.exec(function(err,resii){
					if (err) return res.json({code:1,data:err,msg:"get actives error."});

					fairActive.find(search).count(function(err,count){

						if (err) return res.json({code:1,data:err,msg:"get actives count error."})

						return res.json({
							code:0,
							data:{
								cateNav:cateNav,
								items:!!resii?resii.map(function(a){
									return {
										activitiesNumber:a.activitiesNumber,
        								activitiesStatus:a.activitiesStatus,
        								canRegister:a.canRegister,
        								appImg:a.appImg,
        								createdTime:a.createdTime,
        								deadlineTime:a.deadlineTime,
        								details:a.details,
        								endTime:a.endTime,
        								id:a.id,
        								industryId:a.industryId,
        								industryNameEn:a.industryNameEn,
        								iwId:a.iwId,
        								iwNameEn:a.iwNameEn,
        								maxActivitiesNumber:a.maxActivitiesNumber,
        								minActivitiesNumber:a.minActivitiesNumber,
        								name:a.name,
        								pageViews:a.pageViews,
        								statrTime:a.statrTime,
        								totalVisitNumber:a.totalVisitNumber
									}
								}):[]
							},
							page:page,
							pageSize:pageSize,
							maxPage:Math.ceil(count/pageSize),
							total:count
						})
					})
				})

		})


}

exports.getFairBanner = function(req,res){
	var search;

	search = {area:11}

	ads.find(search)
		.sort("sortid")
		.limit(3)
		.exec(function(err,bannerRes){
			if (err) return res.json({code:1,msg:err});

			return res.json({code:0,data:bannerRes});

		})

}

function treeCategory(res){
	var _ARR = JSON.parse(JSON.stringify(res));
	var RETURN_OBJ = {},
		RECENT_industryId = [],
		PAST_industryId = [],
		industry_recent_obj = {},
		industry_past_obj = {},
		iw_recent_obj = {},
		iw_past_obj = {},
		recent_hasOther = false,
		past_hasOther = false;


	_ARR.forEach(function(item,index){
		switch(item.activitiesStatus){
			case 1:
				if (industry_recent_obj[item.industryId]!=item.industryId) {

					industry_recent_obj[item.industryId] = item.industryId;

					!!item.industryId?RECENT_industryId.push({
						industryId:item.industryId,
						industryNameEn:item.industryNameEn
					}):(recent_hasOther = true);

					

					iw_recent_obj[item.industryId] = {};

					if (!!item.iwId&&iw_recent_obj[item.industryId][item.iwId]!=item.iwId) {
						iw_recent_obj[item.industryId][item.iwId] = item.iwId
						RECENT_industryId[RECENT_industryId.length-1].cluster = [{
							iwId:item.iwId,
							iwNameEn:item.iwNameEn
						}];
					}

				}else {
					RECENT_industryId.forEach(function(a,index){

						if (a.industryId == item.industryId&&(!!item.iwId)&&iw_recent_obj[item.industryId][item.iwId]!=item.iwId) {
							iw_recent_obj[item.industryId][item.iwId] = item.iwId
							a.cluster.push({iwId:item.iwId,iwNameEn:item.iwNameEn});
						}
					})
				}
				break;
			default:
				if (industry_past_obj[item.industryId]!=item.industryId) {
					industry_past_obj[item.industryId]=item.industryId;

					!!item.industryId?PAST_industryId.push({
						industryId:item.industryId,
						industryNameEn:item.industryNameEn
					}):(past_hasOther=true);
					

					iw_past_obj[item.industryId] = {};

					if (!!item.iwId&&iw_past_obj[item.industryId][item.iwId]!=item.iwId) {
						iw_past_obj[item.industryId][item.iwId] = item.iwId
						PAST_industryId[PAST_industryId.length-1].cluster = [{
							iwId:item.iwId,
							iwNameEn:item.iwNameEn
						}];
					}
				}else{
					PAST_industryId.forEach(function(a,index){

						if (a.industryId == item.industryId&&(!!item.iwId)&&iw_past_obj[item.industryId][item.iwId]!=item.iwId) {
							iw_past_obj[item.industryId][item.iwId] = item.iwId
							a.cluster.push({iwId:item.iwId,iwNameEn:item.iwNameEn});
						}
					})
				}
		}
	})
	recent_hasOther?RECENT_industryId.push({
		industryId:0,
		industryNameEn:"Other"
	}):RECENT_industryId;
	past_hasOther?PAST_industryId.push({
		industryId:0,
		industryNameEn:"Other"
	}):PAST_industryId;
	RETURN_OBJ.recent = RECENT_industryId;
	RETURN_OBJ.past = PAST_industryId;

	return RETURN_OBJ;
}


