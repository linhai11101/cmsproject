/*
*快速航运首页
*@time 2017/01/21
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var FastShipIndexModuleSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	img:{
		type:String,
		default:'image'
	},
	name:String,
	sortId:Number,
	link:String,
	state:Number,
});

var FastShipIndexModule = mongoose.model('FastShipIndexModule',FastShipIndexModuleSchema);
module.exports = FastShipIndexModule;