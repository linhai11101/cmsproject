/*
*快速航运产品
*@time 2017/01/19
*/

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var FastShipProductSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	sortId:{
		type:Number,
		default:1
	},
	state:{
		type:String,
		default:'1'
	},
	img:{
		type:String,
		default:'iamge'
	},
	parentId:String,
	sld:String,//关联的三级域名
	id:Number,
	name:String,
	price:String,
	marketPrice:String
});

var FastShipProduct = mongoose.model('FastShipProduct',FastShipProductSchema);
module.exports = FastShipProduct;