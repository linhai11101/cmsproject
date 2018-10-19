/*
*专业镇大首页活动推荐
*@time 2017/01/04
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var IndustrialIndexActSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	img:{
		type:String,
		default:'image'
	},
	activitiesNumber:Number,	//已参加活动人数
	deadlineTime:String,		//报名截止时间
	details:String,
	id:Number,
	iwId:Number,
	name:String,
	sortId:Number,
	indexActId:Number,			//活动id
    activitiesStatus:Number,	//活动状态	number	
    canRegister:Number,			//活动剩余可报名人数	number					
    details:String,				//活动详情	string	
    endTime:String,				//活动结束时间	string		
    maxActivitiesNumber:Number,	//活动人数上限	number	
    minActivitiesNumber:Number,	//活动人数下限	number
    statrTime:String,			//活动开始时间
    iamge:String,
    // 2017-03-03
    totalVisitNumber:{			//活动参与人数
    	type:Number,
    	default:0
    },
    // 2017-03-10
    createdTime:{				//活动创建时间
    	type:String,
    	default:'',
    },
	pageViews:{					//浏览量
		type:Number,
		default:'',
	}
});

var IndustrialIndexAct = mongoose.model('IndustrialIndexAct',IndustrialIndexActSchema);
module.exports = IndustrialIndexAct;