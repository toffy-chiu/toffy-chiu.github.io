var fs = require('fs');
var path = require('path');
var dir=__dirname + '/baoxian/';

//同级目录下批量移除MP3名称时间后缀
/*
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
*/

//递归遍历目录及子目录下批量移除MP3名称时间后缀
function readdirSync(dirPath) {
	//返回文件和子目录的数组
	const files = fs.readdirSync(dirPath);
	files.forEach(function(file){
		const curPath = path.join(dirPath, file);
		//同步读取文件夹文件，如果是文件夹，在重复触发函数
		if(fs.statSync(curPath).isDirectory()) {
			//继续遍历
			readdirSync(curPath);
		}else if(path.extname(file)==='.mp3'){
		  fs.rename(curPath, curPath.slice(0, -17)+'.mp3', function(err){});
		}
	});
}

readdirSync(dir);