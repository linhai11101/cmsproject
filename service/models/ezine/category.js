var mongoose = require('mongoose')
var shortid = require('shortid')

var Schema = mongoose.Schema

var CategorySchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  //排序
  sortId:  {
    type: Number,
    default: 1
  },
  //是否显示栏目,默认显示
  isHidden: {
    type: Number,
    default: 1
  },
  //父级id, 默认为0， 为顶级
  parentid:{
    type: String,
    default: '0'
  },
  isCate:{
    type:Boolean,
    default:true
  },
  bgImg:String,
  iconImg:String,
  img:String,
  appLink:String
});

var Category = mongoose.model('ezinecategory', CategorySchema);

module.exports = Category;