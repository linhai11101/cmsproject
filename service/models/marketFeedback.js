var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var MarketFeedbackSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  content:String,
  createdTime:String,
  feedbackNumber:String,
  name:String,
  iwId:String,
  sumScore:String,
  id:Number,
  title:String,
  img: String,
  sortId:{          //排序 正整数
    type: Number,
    default: 1
  },
  // 2017-03-25
  imgs:{            //反馈图片
    type:String,
    default:''
  },
  photo:{           //反馈人头像
    type:String,
    default:''
  }
});

var MarketFeedback = mongoose.model('MarketFeedback', MarketFeedbackSchema)

module.exports = MarketFeedback;