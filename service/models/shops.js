/**
 * 广告管理
 * @todo [先不实现]
 * @time 2016/4/19
 */

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var ShopsSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name: String,
  img: String,
  logo: String,
  id: String,
  desc: String,
  type: String,
  //显示位置， 默认首页
  area: {type:String, default:'1'},
  //排序
  sortid: {type:Number, default:1},
  //是否显示
  ishidden: {type:Number, default:1},
  target: {type: String, default: '_blank'},
  date: {type: Date, default: Date.now}
});

var Shops = mongoose.model('Shops', ShopsSchema);

module.exports = Shops;


