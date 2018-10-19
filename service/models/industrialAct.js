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
var IndustrialActSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  
  industrialId:String,//专业镇ID
  actType: {        //1普通活动，2、荣誉资质、证书
    type: String,
    default: '1'
  },  
  name: String,   //基地名

   img: {
    type: String,
    default: '/cms/images/default.png'
  },


  url: String,   //图片外链

  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },


  ishidden: {        //是否公开， 默认公开
    type: String,
    default: '1'
  },

});

var IndustrialAct = mongoose.model('IndustrialAct', IndustrialActSchema)

// Industrial.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = IndustrialAct;
