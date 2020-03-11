var fs = require('fs');
var path = require('path');
var dir=__dirname + '/baoxian/';

//递归遍历目录及子目录下批量移除MP3名称时间后缀
function readdirSync(dirPath) {
	//返回文件和子目录的数组
	const files = fs.readdirSync(dirPath);
	files.forEach(function(file){
		const curPath = path.join(dirPath, file);
		//同步读取文件夹文件，如果是文件夹，在重复触发函数
		if(fs.statSync(curPath).isDirectory()) {
			//继续遍历
			if(file!=='origin'&&file!=='res'){readdirSync(curPath);}
		}else if(path.extname(file)==='.mp3'){
		  fs.copyFile(curPath, dir+'res/'+path.basename(curPath), function(err){});
		}else if(path.extname(file)==='.jpg'){
		  fs.copyFile(curPath, dir+'res/'+dirPath.slice(dirPath.lastIndexOf('n\\')+2).replace('\\','-')+'_'+path.basename(curPath), function(err){});
		}
	});
}

readdirSync(dir);