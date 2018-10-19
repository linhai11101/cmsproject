var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var InnovativeProductSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name:String,
  priceRange:String,
  minOrder:String,
  cateId:String,
  cateName:String,
  hide:String,
  id:Number,
  sld:String,//关联的三级域名
  sortId:{        //排序 正整数
    type: Number,
    default: 1
  },
  isTop: {          //是否推荐， 默认不推荐
    type: Number,
    default: 1
  },
  img: {
    type: String,
    default:''
  },
  privacy:Number,
  productType:Number,
  unit:String

});

var InnovativeProduct = mongoose.model('InnovativeProduct', InnovativeProductSchema)

module.exports = InnovativeProduct;

/*字段备注*/ 
// id        产品id  
// minOrder  最小起批量 
// name      产品名称  
// priceRange  价格区间 
// privacy   产品私密性（1-开放状态,0-私密状态）  
// type/productType    产品类型（3为创新类，4为设计类）
// unit    计量单位  

