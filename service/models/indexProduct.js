/**
 * 首页产品
 * @time 2016/4/19
 */

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)

var IndexProductSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  title: String, //产品名
  //产品图片
  img: {
    type: String,
    default: '/images/default.jpg'
  },
  //产品链接
  link: String,
  //楼层id
  floorid: {
    type: String,
    ref: 'IndustrialMenu'
  },
  //产品类型 默认'a', 不同类型，不同尺寸，放的地方也不同 还有a，b, c,
  type: {
    type: String,
    default:'a'
  },
  //排序 正整数
  sortId:{
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
  }
});

var IndexProduct = mongoose.model('indexProducts', IndexProductSchema);


module.exports = IndexProduct;
