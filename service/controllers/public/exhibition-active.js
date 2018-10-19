var _ = require("underscore");
var eventproxy = require("eventproxy");

var fairActive = require("../../models/fair-active");
var Ads = require("../../models/ads");


exports.exhActiveIndex = function (req,res){
	var industryId,iwId,search = {isTop:1},activitiesStatus,flag,sign;

	flag = req.params.flag;
	industryId = req.query.industryId;
	iwId = req.query.iwId;
	if (!!industryId) search.industryId = industryId;
	if (!!iwId) search.iwId = iwId;
	switch(flag) {
		case "recent":
			activitiesStatus = 1;
			sign = 1;
			break;
		case "past":
			activitiesStatus = 0;
			sign = 2;
			break;
		default:
			activitiesStatus = null;
			sign = 0;
	}
	if (activitiesStatus!=null) search.activitiesStatus = activitiesStatus;

	var ep = new eventproxy();

	ep.all('data','cateNav','banner',function(data,cateNav,banner){
		res.render("exh-act-invite/exh-act-invite",{
			base:data,
			cateNav:cateNav,
			sign:sign,
			clusterType:3,
			banner:banner
		})
	})

	fairActive
		.find(search)
		.exec(function(err,fairData){

			if (err) ep.emit('data',[]);

			ep.emit("data",fairData || []);
		})

	fairActive
		.find()
		.exec(function(err,cateNavRes){

			if (err) ep.emit('cateNav',[]);

			var _cateNav = treeCategory(cateNavRes);

			ep.emit("cateNav",_cateNav || []);
		})

	Ads.find({area:10})
		.sort("sortid")
		.exec(function(err,fairRes){
        if (err) fairRes = [];
        if (!fairRes || fairRes.length == 0) fairRes = [];

        ep.emit('banner', fairRes);

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
		iw_past_obj = {};

	_ARR.forEach(function(item,index){
		switch(item.activitiesStatus){
			case 1:
				if (industry_recent_obj[item.industryId]!=item.industryId) {

					industry_recent_obj[item.industryId] = item.industryId;

					RECENT_industryId.push({
						industryId:item.industryId,
						industryNameEn:(item.industryId==0)?"Other":item.industryNameEn
					});

					iw_recent_obj[item.industryId] = {};

					RECENT_industryId[RECENT_industryId.length-1].cluster = [];

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
					PAST_industryId.push({
						industryId:item.industryId,
						industryNameEn:(item.industryId==0)?"Other":item.industryNameEn
					});

					iw_past_obj[item.industryId] = {};

					PAST_industryId[PAST_industryId.length-1].cluster = [];

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
	RETURN_OBJ.recent = RECENT_industryId;
	RETURN_OBJ.past = PAST_industryId;

	return RETURN_OBJ;
}

