/*
*快速航运频道分类
*@time 2017/01/19
*/

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var FastShipChennalCateSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	state:{
		type:String,
		default:'1'
	},
	name:String,
	sortId:Number,
	type:Number,

});

var FastShipChennalCate = mongoose.model('FastShipChennalCate',FastShipChennalCateSchema);
module.exports = FastShipChennalCate;