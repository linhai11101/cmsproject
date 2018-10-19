/**
 * 广货基地
 * @time 2016/4/21
 */
var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var MarketBannerSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  iwId:String,
  name: String,
  img: String,
  link:String,
  place:String
});

var MarketBanner = mongoose.model('MarketBanner', MarketBannerSchema)

module.exports = MarketBanner;