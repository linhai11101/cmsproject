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
var SpecialBannerSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  
   img: {
    type: String,
    default: '/cms/images/default.png'
  },

  link: String,   //图片外链
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },

  time: String, //创建时间
  ishidden: {        //是否公开， 默认公开
    type: String,
    default: '1'
  }

});

var SpecialBanner = mongoose.model('SpecialBanner', SpecialBannerSchema);



module.exports = SpecialBanner;
