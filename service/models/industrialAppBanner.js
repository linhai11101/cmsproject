/*
*appbanner
*@Time 2017-01-16
*/

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;
 
var IndustrialAppBannerSchema = new Schema({
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
	industryId:Number,
	link:String,
});

var IndustrialAppBanner = mongoose.model('IndustrialAppBanner',IndustrialAppBannerSchema);
module.exports = IndustrialAppBanner;