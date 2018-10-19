/*
*app推荐
*@Time 2017-01-13
*/
var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;
 
var IndustrialAppSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	img:{
		type:String,
		default:'image'
	},
	sortId:{
		type:Number,
		default:1
	},
	name:String,
	iwId:Number,
	id:Number, //主键id
	type:String, //类型
	// 活动
	numberNo:String,
	activityName:String,
	// 专业市场
	wsName:String,
	numberNo:String,
	// 评价
	content:String,
	createdTime:String,
	userName:String,
	title:String,
	// 店铺
	shopName:String,
	// 商品
	minOrder:Number,
	proName:String,
	price:Number
});

var IndustrialApp = mongoose.model('IndustrialApp',IndustrialAppSchema);
module.exports = IndustrialApp;