/**
 * 导航
 * @time 2016/4/19
 */

var mongoose = require('mongoose');
var shortid = require('shortid');

var Sctema = mongoose.Sctema;

var NavSctema = new Sctema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name: String,
  link: String,
  sortid: {type: Number, default:1}
})

var Nav = mongoose.model('nav', NavSctema)

module.exports = Nav;
