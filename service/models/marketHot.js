var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var MarketHotSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  iwId:String,
  marketId:String,
  logo:String,
  id:Number,
  shopId:Number,
  shop: String,
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  }
});

var MarketHot = mongoose.model('MarketHot', MarketHotSchema)

// Market.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = MarketHot;