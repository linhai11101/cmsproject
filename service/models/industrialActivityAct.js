/*
*具体专业镇活动
*@time 2017/01/05
*/ 
var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var IndustrialActivityActSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	image:{
		type:String,
		default:'image'
	},
	details:{
		type:String,
		default:'This is activity details.'
	},
	activitiesNumber:Number,	//已参加活动人数
	deadlineTime:String,		//报名截止时间
	iwId:Number,
	name:String,
	sortId:Number,
	activityActId:Number,			
    activitiesStatus:Number,	//活动状态	number	
    canRegister:Number,			//活动剩余可报名人数	number					
    details:String,				//活动详情	string	
    endTime:String,				//活动结束时间	string		
    maxActivitiesNumber:Number,	//活动人数上限	number	
    minActivitiesNumber:Number,	//活动人数下限	number
    statrTime:String,			//活动开始时间
    // 2017-03-10
    createdTime:{				//活动创建时间
    	type:String,
    	default:'',
    },
	pageViews:{					//浏览量
		type:Number,
		default:'',
	},
});

var IndustrialActivityAct = mongoose.model('IndustrialActivityAct',IndustrialActivityActSchema);

module.exports = IndustrialActivityAct;