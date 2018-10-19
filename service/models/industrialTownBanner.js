/*
*具体专业镇banner
*@time 2017/01/05
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var IndustrialTownBannerSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	describe:String,
	img:String,
	iwId:Number,
	link:String,
	name:String,
	place:Number,
	sortId:Number,
});

var IndustrialTownBanner = mongoose.model('IndustrialTownBanner',IndustrialTownBannerSchema);
module.exports = IndustrialTownBanner;