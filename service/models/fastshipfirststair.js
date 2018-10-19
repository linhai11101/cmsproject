/*
*快速航运一级类目
*@time 2017/01/19
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var FastShipFirstStairSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	img: String,
	name:String,
	sortId:Number,
	link:String,
	state:Number
});

var FastShipFirstStair = mongoose.model('FastShipFirstStair',FastShipFirstStairSchema);
module.exports = FastShipFirstStair;