var fs = require('fs');
var path = require('path');
var dir=__dirname + '/baoxian';


function readdirSync(dirPath) {
	const index=dirPath.lastIndexOf(path.sep);
	const dirName=dirPath.slice(index+1);
	//返回文件和子目录的数组
	const files = fs.readdirSync(dirPath);
	files.forEach(function(file){
		const curPath = path.join(dirPath, file);
		//同步读取文件夹文件，如果是文件夹，在重复触发函数
		if(fs.statSync(curPath).isDirectory()) {
			//继续遍历
			readdirSync(curPath);
		}else if(path.extname(file)==='.mp3'){
			//找到包含MP3的文件夹开始处理
			const pictureCount=fs.readdirSync(dirPath+path.sep+'origin').length;
			const fullName=path.basename(file, '.mp3');
			const prefix = fullName.split(' ')[0];
			const name = fullName.split(' ')[1];
			console.log("{prefix:'"+prefix+"',name:'"+name+"',pictureCount:"+pictureCount+"},");
		}
	});
}


for(var i=1;i<=14;i++){
	readdirSync(dir+path.sep+i);
}