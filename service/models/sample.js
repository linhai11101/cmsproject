/**
 * 广货基地
 * @time 2016/4/21
 */
var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var SampleSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name: String,   //基地名
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },
  state: {        //是否公开， 默认公开
    type: String,
    default: '1'
  }
});

var Sample = mongoose.model('Sample', SampleSchema)

// Sample.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = Sample;
