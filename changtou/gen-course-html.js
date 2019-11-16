var fs = require('fs');
var path = require('path');
var dir=__dirname + '/gujin';

const title='股票进阶课';
const MAX_CHAPTER=14;
var chapterList=[];
const courseNameMap={
	1:'两招判断好生意——活得久',
	2:'两招判断好生意——现金流三拷问',
	3:'现金流三拷问——投资环节',
	4:'现金流三拷问——运营、销售环节',
	5:'好公司——商业逻辑分析',
	6:'好公司——护城河分析',
	7:'好公司——盈利源泉分析',
	8:'盈利源泉是否可持续（一）',
	9:'盈利源泉是否可持续（二）',
	10:'好价格——金鹅估值法',
	11:'股市风险',
	12:'安全边际',
	13:'买卖一条龙',
	14:'打败心理大魔王',
};

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
			//找到包含MP3的文件夹开始处理
			const name=path.basename(file, '.mp3');
			const s=name.split(' ');
			const number=s[0].split('-');
			chapterList.push({
				course:number[0],
				chapter:number[1],
				name:s[1]
			});
		}
	});
}

//获取所有小节列表
//readdirSync(dir);
for(var i=1;i<=MAX_CHAPTER;i++){
	readdirSync(dir+path.sep+i);
}

//按章节排序
chapterList.sort(function(a, b){
	return +(a.course+'0'+a.chapter)-(b.course+'0'+b.chapter);
});

//生成内容
var content='';
var tmpCourse;
chapterList.forEach(function (o, i) {
    if(o.course!==tmpCourse){
        //如果不是第1章
        if(i>0){
            content+='</ul>';
        }
        content+='<h3>第'+o.course+'课 '+(courseNameMap[o.course]||'')+'</h3>';
        content+='<ul>';
        tmpCourse=o.course;
    }
    content+='<li><a href="./'+o.course+'/'+o.chapter+'/index.html">第'+o.chapter+'节 '+o.name+'</a></li>';

    //最后一项
    if(i===chapterList.length-1){
        content+='</ul>';
    }
});

const template=fs.readFileSync('course-template.html', {flag: 'r+', encoding: 'utf8'});

fs.writeFile(path.join(dir, 'index.html'), template.replace('${title}', title).replace('${content}', content), {flag: 'w',encoding:'utf-8'}, function (err) {
    if(err) {
        console.error(err);
    } else {
        console.log('写入成功');
    }
});