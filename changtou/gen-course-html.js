var fs = require('fs');
var path = require('path');
var dir=__dirname + '/baoxian';

const title='保险实战课';
const MAX_CHAPTER=14;
var chapterList=[];
const courseNameMap={
	1:'你需要买保险吗？',
	2:'社保和商业保险，怎么取舍？',
	3:'你一定要懂的保险基础知识',
	4:'直面死亡，我们需要寿险（上）',
	5:'直面死亡，我们需要寿险（下）',
	6:'实操：寿险产品分析及推荐',
	7:'关于重疾险，你必须知道的几件事！',
	8:'实操：重疾险产品分析及推荐',
	9:'除了重疾险，你还该有医疗险（附实操）',
	10:'意外险，杠杆率最高的保险',
	11:'实操：意外险产品分析及推荐',
	12:'如何规划一个靠谱的人身保险方案？',
	13:'实操：保险规划方案分析',
	14:'买保险，这些知识不可不知！',
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