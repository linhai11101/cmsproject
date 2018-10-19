var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10


//定义一个新的模型
var UserSchema = new Schema({
  name: String,
  password: String,
  //角色
  //0 -> 普通用户
  //>10 -> 管理员
  role: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {type: Date, default: Date.now}, //创建时间
    updateAt: {type: Date, default: Date.now} //更新时间
  }
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {return next(err)}
      user.password = hash;
      next()
    })
  })
})

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) {return cb(err)}
      cb(null, isMatch)
    })
  }
}

UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

var User = mongoose.model('Users', UserSchema);


module.exports = User
