var fs = require('fs');
var path = require('path');
var dir=__dirname + '/jijin';

const title='基金初级训练营';
var chapterList=[];
const courseNameMap={
	1:'轻松投资，买什么能赚钱？',
	2:'开扒基金家族',
	3:'基金那么多，要稳健，选哪只？',
	4:'基金那么多，要收益，选哪只？',
	5:'收益+稳健，打败巴菲特的指数基金！',
	6:'指数基金怎么挑？3招就搞定',
	7:'指数基金何时买？巧用长投温度',
	8:'指数基金怎么买？定投VS一次性投资',
	9:'指数基金怎么买？简投法4步走',
	10:'实操：如何定制自己的定制方案？',
	11:'指数基金在哪儿买？场内VS场外',
	12:'投资心理建设宝典',
	13:'学会资产配置，更安稳地赚钱',
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
readdirSync(dir);

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