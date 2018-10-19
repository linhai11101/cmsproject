/*
*专业镇top100
*@time 2016/12/28
*/ 
var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

// 定义top100新模型
var IdustrialTopsSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	name:{
		type:String,
		default:'某品牌'
	},
	sortId:{
		type:Number,
		default:1
	},
	logo:{
		type:String,
		default:'image'
	},
	iwId:Number,
	companyId:Number,
	link:String
})

var IndustrialTops = mongoose.model('industrialTops',IdustrialTopsSchema);

module.exports = IndustrialTops;