var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var MarketBestProductSchema = new Schema({
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
  img:'',
  // 2017-03-25
  type:Number     //商品类型，产品类型 1：一般类 2：快运类 3：创新类 4：新设计类
});

var MarketBestProduct = mongoose.model('MarketBestProduct', MarketBestProductSchema)

module.exports = MarketBestProduct;