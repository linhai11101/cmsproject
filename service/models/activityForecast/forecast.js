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

var ForecastSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	img:String,
	title:String,
	describe:String,
	time:String,
	participant:String,
	sortId:Number,
	target:String,
	ishidden:Number,
	parentId:String
	
})

var Forecast = mongoose.model('Forecast', ForecastSchema)

module.exports = Forecast;
