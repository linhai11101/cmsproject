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
var IndustrialNewsSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  industrialId: String, //基地id
  name: String,   //文章名称
  shortTitle: String,   //短标题
   newsType: {        //1文章，2、视频
    type: String,
    default: '1'
  },  

  videoUrl:String,
  newsUrl:String,
   img: {
    type: String,
    default:'/cms/images/default.png'
  },
  
  keywords: String,   //关键词
  summary: String,   //描述
  content: String, //产业介绍
 
   sortId:{        //排序 正整数
    type: Number,
    default: 1
  },


  recommend:{        //推荐 正整数
    type: Number,
    default: 1
  },

  ishidden: {        //是否公开， 默认公开
    type: Number,
    default: '1'
  },
  sources: {
    type: Number,
    default: 1
  },
  author:String,

  date: {type: Date, default: Date.now}, //创建时间
  updateDate: {type: Date, default: Date.now} //更新时间
});

var IndustrialNews = mongoose.model('IndustrialNews', IndustrialNewsSchema)

// Industrial.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = IndustrialNews;
