var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var MarketHotProductSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  shopId:String,
  iwId:String,
  marketPrice:String,
  productId:Number,
  name: String,
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },
  img:''
});

var MarketHotProduct = mongoose.model('MarketHotProduct', MarketHotProductSchema)

module.exports = MarketHotProduct;