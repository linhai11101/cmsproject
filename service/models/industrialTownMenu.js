/*
*专业镇分类菜单
*@time 2016/12/31
*/

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

// 定义专业镇分类菜单模型
var IndustrialTownMenuSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	iwId:Number,
	name:{
		type:String,
		default:'一条类目'
	},
	sortId:Number,
	link:String,
	cateId:Number,
	menuChilds:[Schema.Types.Mixed]
});

var IndustrialTownMenu = mongoose.model('IndustrialTownMenu',IndustrialTownMenuSchema);

module.exports=IndustrialTownMenu;