var fs = require('fs')
var path = require('path');
var eventproxy = require('eventproxy');
//仅支持views目录
var getViewsFiles = function(req, res) {
  var dir = req.query.dir || '';
  if (/^(\/)*\.\..*/.test(dir)) {
    return res.json({status:0, msg:'请传入正确的目录'});
  }
  var ep = new eventproxy();
  var viewsPath = path.join(__dirname, '../views', dir);
  var filesDate = [];
  fs.readdir(viewsPath, function(err, files) {
    if (err) {
      return res.json({status:0,msg:err});
    }
    ep.after('files', files.length, function(){
      res.json({status:1, data:filesDate});
    });

    files.forEach(function(file, i){
      fs.stat(path.join(viewsPath, file), function(err, res) {
        if (res.isDirectory()) {
          filesDate.push({
            name: file,
            type: 'folder',
            path: path.join(dir, file)
          })
        } else {
          var fileType =  file.substr(file.lastIndexOf('.'), file.length);
          var type;
          switch (fileType) {
            case '.html':
              type = 'html';
              break;
            case '.js':
              type = 'js';
              break;
            case '.css':
              type = 'css';
              break;
            case '.png':
            case '.gif':
            case '.jpg':
              type = 'image';
              break;
          }
          filesDate.push({
            name: file,
            type: type,
            path: path.join(dir, file)
          })
        }
        ep.emit('files');
      })
    })
  })
}

var getFileContent = function(req, res) {
  var dir = req.query.dir || '';
  if (/^(\/)*\.\..*/.test(dir)) {
    return res.json({status:0, msg:'请传入正确的目录'});
  }
  var viewsPath = path.join(__dirname, '../views', dir);
  fs.readFile(viewsPath, 'utf-8', function(err, content){
    if (err) {
      return res.json({status:0,msg:err})
    }
    res.json({status:1, data:{content: content}})
  })
}

var saveFileContent = function(req, res) {
  var dir = req.body.dir || '';
  var content = req.body.content || '';
  if (/^(\/)*\.\..*/.test(dir)) {
    return res.json({status:0, msg:'请传入正确的目录'});
  }
  var viewsPath = path.join(__dirname, '../views', dir);
  fs.writeFile(viewsPath, content, 'utf-8', function(err){
    if (err) {
      return res.json({status:0,msg:err})
    }
    res.json({status:1})
  })
}


exports.getViewsFiles = getViewsFiles;
exports.getFileContent = getFileContent;
exports.saveFileContent = saveFileContent;
