var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var InnovativeSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  id:String,
  nameCn:String,
  nameEn:String,
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },
  img: {
    type: String
  },
  ishidden: {        //是否公开， 默认公开
    type: String,
    default: '1'
  }

});

var Innovative = mongoose.model('Innovative', InnovativeSchema)

// Innovative.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = Innovative;