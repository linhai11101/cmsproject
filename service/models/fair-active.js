/*
*展贸活动
*@time 2017/10/11
*/
var mongoose = require("mongoose");
var shortid = require("shortid");

// 创建模式
var Schema = mongoose.Schema;
// 实例化一个模式
var FairActiveSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	activitiesNumber:Number,					//活动已报名人数		
    activitiesStatus:Number,					//活动状态		
    canRegister:Number,					//活动剩余可报名人数		
    createdTime:String,					//活动创建时间		
    deadlineTime:String,					//报名截止时间		
    details:String,					//活动描述		
    endTime:String,					//活动结束时间		
    id:Number,					//活动id		
    image:String,					//活动封面图片		
    industryId:Number,					//行业id		
    iwId:Number,					//专业镇id或批发中心id
    maxActivitiesNumber:Number,					//活动人数上限		
    minActivitiesNumber:Number,					//活动人数下限		
    name:String,					//活动名称		
    numberNo:String,					//活动编号		
    pageViews:Number,					//浏览量		
    statrTime:String,					//活动开始时间		
    totalVisitNumber:Number,					//活动参与人数	
    iwNameEn:String,
    industryNameEn:String,	
    address:String,
    cmsImg:{						//cms上传的封面图片
    	type:String,
    	default:""
    },
    appImg:{
        type:String,
        default:""
    },
    sortId:{
    	type:Number,
    	default:null
    },
    isTop:{						//是否推荐
    	type:Number,
    	default:1
    }
})

var FairActive = mongoose.model("fairactive",FairActiveSchema);

module.exports = FairActive;

