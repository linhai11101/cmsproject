/**
 * 首页产品
 * @time 2016/4/19
 */

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)

var SpecialProductSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  number:Number,
  name: String, //产品名
  //产品图片
  img: {
    type: String,
    default: '/images/default.jpg'
  },
  promotionId:Number,
  //产品链接
  link: String,
  free:Boolean,
  quantityMax:Number,
  //分类id
  cateId: String,
  price: String, //价格
  tag: String, //折扣图形
  endTime:String,//结束时间
  remainTime:Number,//剩余时间秒数
  productId: String, //产品id
  discount:String,
  discountPrice:String,
  cateName:String,
  sld:String,//关联的三级域名
  //是否推荐， 默认不推荐
  isrecommend:{
    type: Number,
    default: 1
  },
  endTimes:{//结束的时分秒
    type:String,
    default:"00:00:00"
  },
  isTop: {
    type: Number,
    default: 1
  }
});

var SpecialProduct = mongoose.model('SpecialProduct', SpecialProductSchema);


module.exports = SpecialProduct;
