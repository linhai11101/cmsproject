var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var MarketBestSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  iwId:String,
  img:String,
  id:Number,
  shopId:Number,
  shop: String,
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },
  // 2017-03-25
  companyLogo:{    //公司logo
    type:String,
    default:''
  }
});

var MarketBest = mongoose.model('MarketBest', MarketBestSchema)

module.exports = MarketBest;