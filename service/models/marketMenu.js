/**
 * 广贸基地产品
 * @time 2016/4/21
 */

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)

var MarketMenuSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name: String, //菜单名
  link: String, //产品链接
  parentid: String, //产品
  iwId: String,
  sortId: {type: Number, default: 0}, //是否推荐， 默认不推荐
  ishidden: {
    type: Number,
    default: 1
  },
  date: {type: Date, default: Date.now}, //创建时间
  updateDate: {type: Date, default: Date.now} //更新时间
});

var MarketMenu = mongoose.model('MarketMenu', MarketMenuSchema);


module.exports = MarketMenu;
