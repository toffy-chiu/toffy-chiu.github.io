var fs = require('fs');
var path = require('path');
var dir=__dirname + '/gupiao';

const title='股票初级训练营';
var chapterList=[];
const courseNameMap={
	1:'迈出股票投资第一步：找准入市时机',
	2:'建立你的投资组合：合理规避风险',
	3:'“好公司”投资法：初筛白马股',
	4:'“好公司”投资法：剔除周期股',
	5:'“好公司”投资法：剔除基本面转坏的股票',
	6:'财务三表分析(1) 如何识别收入美化',
	7:'财务三表分析(2) 如何识别资产美化',
	8:'财务三表分析(3) 自由现金流的重要性',
	9:'实操：构建你的白马组合',
	10:'“捡烟蒂”投资法：便宜组合',
	11:'“捡烟蒂”投资法：便宜组合实操构建',
	12:'实战：第一次“下注”买股票',
	13:'股海沉浮·锦囊妙计',
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
for(var i=1;i<=13;i++){
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
        content+='<h3>第'+o.course+'天 '+(courseNameMap[o.course]||'')+'</h3>';
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