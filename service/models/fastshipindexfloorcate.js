/*
*快速航运首页
*@time 2017/01/21
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var FastShipIndexFloorCateSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	name:String,
	sortId:Number,
	state:Number,
	floorId:String,
	link:String
});
var FastShipIndexFloorCate = mongoose.model('FastShipIndexFloorCate',FastShipIndexFloorCateSchema);
module.exports = FastShipIndexFloorCate;