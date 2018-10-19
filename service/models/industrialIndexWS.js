/*
*专业镇大首页活动推荐
*@time 2017/01/04
*/ 

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var IndustrialIndexWSSchema = new Schema({
	_id:{
		type:String,
		unique:true,
		default:shortid.generate
	},
	iwId:Number,			//专业镇id
	indexWSId:Number,		//批发市场id
	nameEn:String,			//批发市场英文名称
	img:String,				//cms上传图片
	sortId:Number,			//排序id
	//2017-03-25
	propagandaPicture:{		//宣传图片 ( 多张 '|' 分割)
		type:String,
		default:''
	},
	searchImage:{			//搜索展示图
		type:String,
		default:''
	},
	avatarImage:{			//圆形头像图片
		type:String,
		default:''
	},
	detailsEn:String,		//批发中心详情
	mainProduct:String		//主营产品
});

var IndustrialIndexWS = mongoose.model('IndustrialIndexWS',IndustrialIndexWSSchema);
module.exports = IndustrialIndexWS;