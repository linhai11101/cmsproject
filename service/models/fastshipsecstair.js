/*
*快速航运二级类目
*@time 2017/01/19
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var FastShipSecStairSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	name:String,
	sortId:Number,
	link:String,
	state:Number,
	parentId:String,
});

var FastShipSecStair = mongoose.model('FastShipSecStair',FastShipSecStairSchema);
module.exports = FastShipSecStair;