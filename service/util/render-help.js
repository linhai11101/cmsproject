var config = require('../config');

exports.resize = function(str, width, height, type){
  if (!/^\/group1.*/i.test(str)) {
    return str
  }
  if (width == 'origin') {
    return config.img_host + str;
  }
  width = width || '150';
  height = height || '150';
  type = type || 3;
  var index = str.lastIndexOf('.');
  return config.img_host + str.substr(0, index) +'_'+ width + 'x' + height + '_' + type + str.substr(index, str.length);
}
