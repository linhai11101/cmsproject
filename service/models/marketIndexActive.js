var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var MarketIndexActiveSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  totalVisitNumber:Number,
  canRegister:String,
  activitiesNumber:Number,
  maxActivitiesNumber:String,
  minActivitiesNumber:String,
  deadlineTime:String,
  residue:String,//剩余人数
  createdTime:String,//创建时间
  pageViews:String, //浏览量
  status:String,
  details:String,
  iwId:String,
  pageViews:String,
  id:Number,
  name:String,
  img: String,
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },
  statrTime:{
    type:String,
    default:''
  },
  endTime:{
    type:String,
    default:''
  }
});

var MarketIndexActive = mongoose.model('MarketIndexActive', MarketIndexActiveSchema)

module.exports = MarketIndexActive;