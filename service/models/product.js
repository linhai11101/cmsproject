/**
 * 产品
 * @time 2016/5/13
 */

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  id: String,
  name: String,
  desc: String,
  link: String,
  img: String,
  price: String,
  //显示位置， 默认首页
  area: {type:String, default:'1'},
  type: {type:String, default:'1'},
  //排序
  sortid: {type:Number, default:1},
  //是否显示
  ishidden: {type:Number, default:1},
  target: {type: String, default: '_blank'},
  date: {type: Date, default: Date.now}
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = Product;


