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
var IndustrialIndexCateSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  img: {
    type: String,
    default:'/cms/images/default.png',
  },
  iconImg:{
      type:String,
      default:''
  },
  sortId:{
    type:Number,
    default:1
  },
  state:{
    type:Number,
    default:0
  },
  id:Number,
  nameEn:String,
  FAshow:{
    type:Number,
    default:1
  }
});

var IndustrialIndexCate = mongoose.model('IndustrialIndexCate', IndustrialIndexCateSchema)


module.exports = IndustrialIndexCate;
