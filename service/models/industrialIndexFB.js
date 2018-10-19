/*
*专业镇大首页活动推荐
*@time 2017/01/04
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var IndustrialIndexFBSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	createdTime:{
		type:String,
		default:'2017-02-28 00:00:00'
	},
	feedbackNumber:{
		type:String,
		default:'0'
	},
	iwId:Number,
	content:String,
	indexFBId:Number,
	name:String,
	img:String,
	sortId:Number,
	title:String,
	name:String,
	sumScore:String,
	// 2017-03-25
	imgs:{				//反馈图片
		type:String,
		default:''
	},
	photo:{				//反馈人头像
		type:String,
		default:''
	}
});

var IndustrialIndexFB = mongoose.model('IndustrialIndexFB',IndustrialIndexFBSchema);
module.exports = IndustrialIndexFB;