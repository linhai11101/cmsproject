/**
 * 首页楼层
 * @time 2016/4/19
 */
var mongoose = require('mongoose');
var shortid = require('shortid');

var product = require('./indexProduct')
var logo = require('./indexLogo')

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var IndexFloorSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name: String,   //楼层名
  product:{
    type: String,
    ref: 'product'
  },
  logo: {
    type: String,
    ref: 'logo'
  },
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },
  state: {        //是否公开， 默认公开
    type: String,
    default: '1'
  }
});

var IndexFloor = mongoose.model('indexFloor', IndexFloorSchema)

// IndexFloor.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = IndexFloor;
