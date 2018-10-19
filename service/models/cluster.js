/**
 * 广货基地
 * @time 2016/4/21
 */
var mongoose = require('mongoose');
var shortid = require('shortid');

//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var ClusterSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  // type:Number,
  activitiesNumber:Number,
  avatarImage:String,
  cityId:Number,
  cityName:String,
  clickTraffic:Number,
  collections:Number,
  countryName:String,
  feedbackNumber:Number,
  government:String,
  industryId:Number,
  industryName:String,
  iwDetail:String,
  iwId:Number,
  joinTime:String,
  logo:String,
  mainProduct:String,
  nameEn:String,
  numberNo:String,
  productNumber:Number,
  propagandaPicture:String,
  provinceId:Number,
  provinceName:String,
  searchImage:String,
  sgsHas:Boolean,
  sld:String,
  sumScore:String,
  suppliersNumber:Number,
  volume:Number,
  wcenterNumber:Number,
  sortId:{
    type: Number,
    default: 1
  },
  state: {
    type: String,
    default: '1'
  },
  appSortId: {
    type: Number,
    default: 1
  },
  isTop:{
    type:String,
    default:'0'
  },
  clusterType:Number,
  isCollect:{
    type:Boolean,
    default:false
  },
  img:{
      type:String,
      default:''
  },
  relateIds:{
    type:String,
      default:''
  },
  FAshow:{
    type:Number,
    default:1
  }
});

var Cluster = mongoose.model('Cluster', ClusterSchema);

module.exports = Cluster;

  // activitiesNumber             活动数量  number  
  // avatarImage            圆形头像图片  string  
  // cityId             所在城市id  number  
  // cityName             所在城市名 string  
  // clickTraffic             点击量 number  
  // collection             收藏量 number  
  // countryName            国家名称  string  
  // feedbackNumber             反馈数量  number  
  // government             政府支持  string  
  // industryId             行业id  number  
  // industryName             行业名称  string  
  // iwDetail             专业镇描述 string  
  // iwId             专业镇id number  
  // joinTime             加入时间  string  
  // logo             logo  string  
  // mainProduct            主营产品  string  
  // nameEn             专业镇英文名  string  
  // numberNo             专业镇编号 string  
  // productNumber            产品数量  number  
  // propagandaPicture   宣传图片 ( 多张 '|' 分割) string
  // provinceId             所在省份id  number  
  // provinceName             所在省份名 string  
  // searchImage            搜索展示图 string  
  // sgsHas             是否有SGS  boolean 
  // sld            三级域名  string  
  // sumScore             总评分 string  
  // suppliersNumber            卖家数量  number  
  // volume             成交量 number  
  // wcenterNumber            批发中心数量  number
  // clusterType        集群类型：1为专业镇；2为专业市场。
  //img                 cms上传的图片
  //relateIds           相关联的专业镇或批发市场
  //isTop               是否推荐：0为推荐，1为不推荐
  //FAshow              展贸活动显示（1为显示，0为不显示）
/*
备注：
1，减少关键字字段keywords。
2，表示id统一为iwid和crm的字段相同。
3，collection位mongoose的关键字，不能使用。
4，专业镇和专业市场合并成用一个model。
*/ 



  