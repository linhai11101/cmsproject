/*
*具体专业镇反馈
*@time 2017/01/05
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var IndustrialTownFBSchema = new Schema({
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
	townFBId:Number,
	content:String,
	img:String,
	name:String,
	sortId:Number,
	title:String,
	sumScore:String,
	//2017-03-27
	imgs:{					//多个反馈图片
		type:String,
		default:''
	},
	photo:{					//反馈人头像
		type:String,
		default:''
	}

});

var IndustrialTownFB = mongoose.model('IndustrialTownFB',IndustrialTownFBSchema);
module.exports = IndustrialTownFB;