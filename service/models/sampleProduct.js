/**
 * 首页产品
 * @time 2016/4/19
 */

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)

var SampleProductSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name: String, //产品名
  //产品图片
  img: {
    type: String,
    default: '/images/default.jpg'
  },
  //产品链接
  link: String,
  //楼层id
  pid: String,
  price: String, //价格
  like: {type:Number, default:0}, //点赞数

  //是否推荐， 默认不推荐
  isTop: {
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

var SampleProduct = mongoose.model('SampleProducts', SampleProductSchema);


module.exports = SampleProduct;
