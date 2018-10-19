/*
*快速航运首页
*@time 2017/01/21
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var FastShipIndexFloorProSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	img:{
		type:String,
		default:'iamge'
	},
	name:String,
	sortId:Number,
	link:String,
	sld:String,//关联的三级域名
	price:String,
	marketPrice:String,
	state:Number,
	floorId:String
});

var FastShipIndexFloorPro = mongoose.model('FastShipIndexFloorPro',FastShipIndexFloorProSchema);
module.exports = FastShipIndexFloorPro;
