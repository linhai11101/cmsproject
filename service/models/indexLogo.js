/**
 * 首页logo
 * @time 2016/4/19
 */

var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)


var IndexLogoSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  title: String,
  img: {
    type: String,
    required: true
  },
  link: String,
  floorid: String,
  //排序 正整数
  sortId:{
    type: Number,
    default: 1
  },
  data: {
    type: Date,
    default: Date.now
  },
  updateDate: {
    type: Date,
    default: Date.now
  }
});

var IndexLogo = mongoose.model('indexLogo', IndexLogoSchema);

// IndexLogo.find({'floorid':'B1nluu4l'}, function(err, floor){
//   console.log(floor);
// })

module.exports = IndexLogo;
