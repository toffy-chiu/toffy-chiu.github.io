var APP={
		$c1:$('#c1'),
		$c2:$('#c2'),
		$c3:$('#c3'),
		//=========================
		//	设定哪个人（1、2、3）多少毫秒后掉下
		//=========================
		falling:function(climber,time){
			var that=this
				,$c=$('#c'+climber)
				;
			setTimeout(function(){
				$c.removeClass('climb'+climber).addClass('fall');
				setTimeout(function(){
					$c.removeClass('fall').addClass('climb'+climber);
					that.falling(climber, Math.random()*8000+2000);
				},1000);	//掉下1秒后再爬
			},time);
		},
		//============
		//	加载排名数据
		//============
		loadRanking:function(){
			$.ajax({
				url:'http://gc.3g.cn/testenvandroid/ClientHandle.ashx',
				data:'fid=8851&topNum=10&startDate=2013-10-09&endDate=2013-10-14',//[startDate,endDate)
				dataType:'jsonp',
				jsonp:'callback',
				success:function(json){
//					console.log(json);
					if(json&&json.Ranks&&json.Ranks.length>1){
						var ranks=json.Ranks
							,tops=[]
							;
						$.each(ranks,function(i,r){
							tops.push({nick:r.Nick,win:r.Win});
						});
//						tops.push({nick:'150****3507',win:+new Date()>1381672800000?Math.ceil(ranks[0].Win*1.06):75});
						//重新排序
						tops.sort(function(a,b){return b.win-a.win;});
						$('#tip1').html('<p class="cy-username">'+tops[1].nick+'</p><p>中奖'+tops[1].win+'次</p>');
						$('#tip2').html('<p class="cy-username">'+tops[0].nick+'</p><p>中奖'+tops[0].win+'次</p>');
						$('#tip3').html('<p class="cy-username">'+tops[2].nick+'</p><p>中奖'+tops[2].win+'次</p>');
						var otherRanks='<ul class="cy-otherRank">';
						for ( var int = 3; int < tops.length; int++) {
							otherRanks+='<li>【第'+(int+1)+'名】<b>'+tops[int].nick+'</b> 累计中奖次数 <b style="color:red;">'+tops[int].win+'</b></li>';
						}
						otherRanks+='</ul>';
						$('.chongyang').after(otherRanks);
					}else{
						$('#tip1').html('<p class="cy-username">空缺</p><p>暂无中奖</p>');
						$('#tip2').html('<p class="cy-username">空缺</p><p>暂无中奖</p>');
						$('#tip3').html('<p class="cy-username">空缺</p><p>暂无中奖</p>');
					}
				}
			});
		},
		init:function(){
			var that=this;
			//	选手1
			that.$c1.addClass('climb1');
			that.falling(1, 4000);
			//	选手2
			that.$c2.addClass('climb2');
			that.falling(2, 6000);
			//	选手3
			that.$c3.addClass('climb3');
			that.falling(3, 8000);
			//	加载排名数据
			// that.loadRanking();
		}
};
APP.init();