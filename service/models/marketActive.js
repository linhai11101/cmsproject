var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var MarketActiveSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  totalVisitNumber:Number,
  activitiesNumber:Number,
  canRegister:String,
  maxActivitiesNumber:String,
  minActivitiesNumber:String,
  deadlineTime:String,
  createdTime:String,
  pageViews:String,
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

var MarketActive = mongoose.model('MarketActive', MarketActiveSchema)

// Market.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = MarketActive;