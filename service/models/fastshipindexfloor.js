/*
*快速航运首页
*@time 2017/01/21
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var FastShipIndexFloorsSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	floorImg:{
		type:String,
		default:'image'
	},
	name:String,
	sortId:Number,
	link:String,
	state:Number,
});

var FastShipIndexFloors = mongoose.model('FastShipIndexFloors',FastShipIndexFloorsSchema);
module.exports = FastShipIndexFloors;