/**
 * 广告管理
 * @todo [先不实现]
 * @time 2016/4/19
 */

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var AdsSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name: String,
  link: String,
  img: String,
  width: Number,
  height: Number,
  //显示位置， 默认首页
  area: {type:String, default:'1'},
  //排序
  sortid: {type:Number, default:1},
  appAdvType:String,
  //是否显示
  ishidden: {type:Number, default:1},
  target: {type: String, default: '_blank'},
  date: {type: Date, default: Date.now}
});

var Ads = mongoose.model('ads', AdsSchema);

module.exports = Ads;


