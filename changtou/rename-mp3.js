var fs = require('fs');
var path = require('path');
var dir=__dirname + '/gupiao/';

//批量移除MP3名称时间后缀
fs.readdir(dir, function (err, files) {
  if(err) {
    console.error(err);
    return;
  } else {
    files.forEach(function (file) {
      var filePath = path.normalize(dir + file);
      var ext=file.slice(file.lastIndexOf('.')+1);
	  if(ext==='mp3'){
		  fs.rename(filePath, filePath.slice(0, -17)+'.mp3', function(err){});
	  }
    });
  }
});