/*
*专业镇所有活动
*2017-04-18
*/ 
var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var industrialAActSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	cmsImg:{					//cms上传的图片
		type:String,
		default:'image'
	},
	activitiesNumber:Number,	//已参加活动人数
	deadlineTime:String,		//报名截止时间
	details:String,
	iwId:Number,
	name:String,
	sortId:Number,
	id:Number,					//活动id（crm主键id）
    activitiesStatus:Number,	//活动状态	number	
    canRegister:Number,			//活动剩余可报名人数	number					
    details:String,				//活动详情	string	
    endTime:String,				//活动结束时间	string		
    maxActivitiesNumber:Number,	//活动人数上限	number	
    minActivitiesNumber:Number,	//活动人数下限	number
    statrTime:String,			//活动开始时间
    image:{						//封面图片
    	type:String,
    	default:''
    },				
    totalVisitNumber:{			//活动参与人数
    	type:Number,
    	default:0
    },
    createdTime:{				//活动创建时间
    	type:String,
    	default:'',
    },
	pageViews:{					//浏览量
		type:Number,
		default:'',
	},
	link:{						//cms写入的链接
		type:String,
		default:''
	},
	isRecommend:{				//是否推荐1为推荐
		type:Number,
		default:1
	} 			
});

var industrialAAct = mongoose.model('industrialAAct',industrialAActSchema);

module.exports = industrialAAct;
