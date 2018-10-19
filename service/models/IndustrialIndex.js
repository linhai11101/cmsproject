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
  _id: {  //当前数据ID
    type: String,
    unique: true,
    default: shortid.generate
  },
  id:Number,//专业镇ID
  canVisit:String,
  cityId:Number,
  cityName:String,
  clickTraffic:Number,
  // collection:Number,
  countryName:String,
  government:String,
  iprAuthPhoto:String,
  iwDetail:String,
  mainProduct:String,
  nameEn:String,
  productNumber:Number,
  provinceId:Number,
  provinceName:String,
  sgsAuthPhoto:String,
  volume:Number,
  suppliersNumber:Number,
  // name:String,
  img: {
    type: String,
    default:'/cms/images/default.png',
  },
   sortId:Number,
  state:Number
});

var IndustrialIndex = mongoose.model('IndustrialIndex', IndustrialIndexCateSchema)


module.exports = IndustrialIndex;
