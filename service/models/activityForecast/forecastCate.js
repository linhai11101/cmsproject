/**
 * 活动预告
 * @time 2017/06/14
 */
var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

var ForecastCateSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	name:String,
	link:String,
	sortId:Number,
	ishidden:Number,
	parentId:String
	
})

var ForecastCate = mongoose.model('ForecastCate', ForecastCateSchema)

module.exports = ForecastCate;
