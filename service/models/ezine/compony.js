/*
*电子杂志推荐
*@time 2017/05/09
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;
var ezinecomponySchema = new Schema({
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
    appLink:{
      type:String,
      default:""
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
  	img:String,
  	iconImg:String,
    province:String,
    district:String,
    provinceId:Number,
    districtId:Number,
    clusterType:Number
});

var ezinecompony = mongoose.model('ezinecompony',ezinecomponySchema);
module.exports = ezinecompony;