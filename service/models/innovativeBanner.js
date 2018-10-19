var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var InnovativeBannerSchema = new Schema({
 _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name:String,
  priceRange:String,
  minOrder:String,
  priceRange:String,
  cateId:String,
  cateName:String,
  link:String,
  hide:String,
  id:Number,
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },
  img: {
    type: String
  }

});

var InnovativeBanner = mongoose.model('InnovativeBanner', InnovativeBannerSchema)

// Innovative.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = InnovativeBanner;