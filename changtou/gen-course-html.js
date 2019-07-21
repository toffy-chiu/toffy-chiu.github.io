var fs = require('fs');
var path = require('path');
var dir=__dirname + '/jijin';

const title='基金初级训练营';
var chapterList=[];
var courseMap={};

var template=fs.readFileSync('course-template.html', {flag: 'r+', encoding: 'utf8'});

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
			const name=path.basename(file, '.mp3');
			const s=name.split(' ');
			const number=s[0].split('-');
			chapterList.push({
				course:number[0],
				chapter:number[1],
				name:s[1],
			});
		}
	});
}

//获取所有小节列表
readdirSync(dir);

//按章节排序
chapterList.sort(function(a, b){
	return +(a.course+'0'+a.chapter)-(b.course+'0'+b.chapter);
});

console.log(chapterList);