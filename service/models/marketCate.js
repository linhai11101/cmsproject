var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var MarketCateSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  iwId:String,
  id:Number,
  name:String,
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },
  menuChilds:[Schema.Types.Mixed]
});

var MarketCate = mongoose.model('MarketCate', MarketCateSchema)

module.exports = MarketCate;