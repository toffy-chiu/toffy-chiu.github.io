var fs = require('fs');
var path = require('path');
var images = require('images');
var dir=__dirname + '/baoxian';

var count=0;

function readdirSync(dirPath) {
	const index=dirPath.lastIndexOf(path.sep);
	const dirName=dirPath.slice(index+1);
	const parentDirPath=dirPath.slice(0, index);
	//返回文件和子目录的数组
	const files = fs.readdirSync(dirPath);
	if(dirName==='origin'){
		files.forEach(function(file){
			if(path.extname(file)==='.jpg'){
				//压缩每一张图片
				const curPath = path.join(dirPath, file);
				console.log('正在压缩第'+(++count)+'张图片');
				images(curPath).size(1600).save(path.join(parentDirPath, file), {quality:10});
			}
		});
	}else{
		files.forEach(function(file){
			const curPath = path.join(dirPath, file);
			//同步读取文件夹文件，如果是文件夹，在重复触发函数
			if(fs.statSync(curPath).isDirectory()) {
				readdirSync(curPath);
			}
		});
	}
}

for(var i=1;i<=14;i++){
	readdirSync(dir+path.sep+i);
}

//readdirSync(dir);