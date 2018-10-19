/**
 * 首页产品
 * @time 2016/4/19
 */

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)

var MarketProductSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  id: String,
  title: String, //产品名
  desc: String, //描述
  //产品图片
  img: {
    type: String,
    default: '/images/default.jpg'
  },
  price: String,
  //产品链接
  link: String,
  iwId: String,
  //楼层id
  floorId: {
    type: String,
    ref: 'MarketProductFloor'
  },
  //产品类型 默认'a', 不同类型，不同尺寸，放的地方也不同 还有a，b, c,
  type: {
    type: String,
    default:'1'
  },
  //排序 正整数
  sortId:{
    type: Number,
    default: 1
  },
  //是否可见
  ishidden:{
    type: Number,
    default: 1
  },
  //创建时间
  date: {
    type: Date,
    default: Date.now
  },
  //更新时间
  updateDate: {
    type: Date,
    default: Date.now
  },
  appSortId: {
    type: Number,
    default: 1
  }
});

var MarketProduct = mongoose.model('MarketProduct', MarketProductSchema);


module.exports = MarketProduct;
