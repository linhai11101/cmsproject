/*
*具体专业镇活动
*@time 2017/01/05
*/

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var IndustrialActivityBannerSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	name:String,
	sortId:Number,
	place:String,
	img:String,
	iwId:Number,
	link:String
});

var IndustrialActivityBanner = mongoose.model('IndustrialActivityBanner',IndustrialActivityBannerSchema);
module.exports = IndustrialActivityBanner;