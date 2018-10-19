/*
*电子杂志推荐
*@time 2017/05/09
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;
var ezinereommendSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
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
  	img:String,
    appLink:String,
    area:Number
});

var ezinereommend = mongoose.model('ezinereommend',ezinereommendSchema);
module.exports = ezinereommend;


