/**
 * 导航菜单分类
 * @time 2016/4/19
 */

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
  ishidden: {
    type: Number,
    default: 1
  },
  //父级id, 默认为0， 为顶级
  parentid:{
    type: String,
    default: '0'
  },
  sortPath: String, //类目面包屑
  data: {
    type: Date,
    default: Date.now
  }
});

var Category = mongoose.model('category', CategorySchema);

module.exports = Category;
