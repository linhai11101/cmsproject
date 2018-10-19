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

var ForecastIndexSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	name:String,
	img:String,
	sortId:Number,
	ishidden:Number

})

var ForecastIndex = mongoose.model('ForecastIndex', ForecastIndexSchema)

module.exports = ForecastIndex;

