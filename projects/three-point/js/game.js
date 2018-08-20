var Game = {
    $game: $('#game'),
    $rankBoard: $('#rankBoard'),
    $prev: $('#prev'),
    $next: $('#next'),
    $start: $('#start'),
    $startPanel: $('#start-panel'),
    $playerPanel: $('#player-panel'),
    $playerOk: $('#player-ok'),
    $login: $('#login'),
    $overRound: $('#overRound'),
    $btnOr: $('#btnOr'),
    $ok: $('#ok'),
    $nickName: $('span.nickName'),
    Ball: $('#ball'),
    Shoot: $('#shoot'),
    Slug: $('#slug'),
    SlugWidth: 39,
    Ring: $('#ring'),
    RestCount: $('#restCount'),
    RestText: $('#restCount>div'),
    Retry: $('#retry'),
    $rank: $('#rank'),
    Net: $('#net'),
    Blue: $('#blue'),
    $Time: [$('#time1'), $('#time2'), $('#time3')],
    $Score: [$('#score1'), $('#score2')],
    RingWidth: $('#ring').width(),
    IsShooting: false,
    Timeout: {},
    Score: 0,   //每关小分
    TotalScore: 0,   //总分
    PageIndex: 1,
    PageCount: 1,
    RoundIndex: 0, //第N关
    ShareString: ['我正在参加#3G体育亚锦赛投篮之星大赛#，赢得了#', '#神誉。你是否被各种琐事碎语烦腻了？试着和我一起玩玩这个简单直观粗暴的三分投篮游戏吧，安下心来动动巧指，你或许将是下位三分王！'],
    PlayerClass: ['player1', 'player2', 'player3', 'player4', 'player5'],
    PlayerText: ['你的首轮对手是孙悦！你必须获得至少20分才能击败他并且继续挑战！',
                '<p>恭喜闯关成功！</p>你的第二轮对手是王仕鹏！你必须获得至少22分才能击败他并且继续挑战！',
                '<p>恭喜闯关成功！</p>你的第三轮对手是易建联！你必须获得至少24分才能击败他并且继续挑战！',
                '<p>恭喜闯关成功！</p>你的第四轮对手是王治郅！你必须获得至少26分才能击败他并且继续挑战！',
                '<p>恭喜闯关成功！</p>你的第五轮对手是朱芳雨！你必须获得30分才能击败他进而争夺冠军宝座！'],
    BallPosition: [//篮球初始坐标[left,top]、X方向初速度、Y方向初速度、时间、重力加速度、球是否正在落下、指定球按哪个方向旋转
        {left: 10, top: 155, vx: 1.6, vy: 6.8, lost: [{ x: 1.1, y: 6.0 }, { x: 1.2, y: 6.2 }, { x: 1.1, y: 6.6 }, { x: 1.8, y: 7.0 }, { x: 2.0, y: 7.2}], t: 0, g: 9.8, fall: false, rotate: 'anticlockwise' },
        { left: 35, top: 255, vx: 0.9, vy: 8.5, lost: [{ x: 0.6, y: 8.0 }, { x: 0.7, y: 8.2 }, { x: 1.1, y: 8.6 }, { x: 1.2, y: 8.7}], t: 0, g: 9.8, fall: false, rotate: 'anticlockwise' },
        { left: 142, top: 295, vx: 0, vy: 9.0, lost: [{ x: -0.4, y: 8.4 }, { x: -0.3, y: 8.9 }, { x: 0.3, y: 9.2 }, { x: 0.3, y: 8.4}], t: 0, g: 9.8, fall: false, rotate: 'anticlockwise' },
        { left: 258, top: 250, vx: -1.0, vy: 8.5, lost: [{ x: -0.6, y: 8.0 }, { x: -0.7, y: 8.2 }, { x: -1.2, y: 8.4 }, { x: -1.2, y: 8.7}], t: 0, g: 9.8, fall: false, rotate: 'clockwise' },
        { left: 277, top: 155, vx: -1.6, vy: 6.8, lost: [{ x: -1.1, y: 6.0 }, { x: -1.2, y: 6.2 }, { x: -1.1, y: 6.6 }, { x: -2.0, y: 7.2}], t: 0, g: 9.8, fall: false, rotate: 'clockwise'}],
    BallTime: 0,
    RestCountPos: [[35, 185], [60, 285], [170, 320], [286, 276], [292, 190]],
    PositionIndex: 0, //标示当前在哪个位置上投球
    Init: function (score, speed) {
        if (score == undefined) {
            score = 0;
            this.TotalScore = 0;
            this.RoundIndex = 0;
        }
        if (speed == undefined)
            speed = [1, 1, 1, 1, 1];
        this.PositionIndex = 0; //初始化为位置一
        this.Score = score; //重置分数
        this.SetScore(this.Score);
        this.Time = 120; //重置剩余时间
        if (this.Timeout.timeboard !== undefined) {
            clearTimeout(this.Timeout.timeboard);
        }
        this.TimeBoard(this.Time);
        var that = this;
        this.Timeout.timeboard = setInterval(function () {
            that.TimeBoard(--that.Time);
        }, 1000);
        this.BallRemain = [5, 5, 5, 5, 5]; //每个位置上剩余的球
        this.SetBallPosition();
        this.SetSlugPosition();
        clearTimeout(this.Timeout.ring);
        this.RingSpeed = speed;
        this.StartMoveRing(this.RingSpeed[this.PositionIndex]);
        this.Shoot.show();
    },
    //设置篮球的位置
    SetBallPosition: function () {
        var pos,
            respos,
            ballRemain = this.BallRemain[this.PositionIndex];
        if (ballRemain == 0) {
            this.PositionIndex++;
            ballRemain = this.BallRemain[this.PositionIndex];
        }
        if (this.PositionIndex < 5) {
            this.Ball.removeAttr('class')
                    .addClass(ballRemain == 1 ? 'ball5' : 'ball')
                    .css({ zIndex: '11' }); //过了篮框就把篮球放在最前
            this.RestText.text(ballRemain); //显示当前位置剩余的球数
            respos = this.RestCountPos[this.PositionIndex];
            pos = this.BallPosition[this.PositionIndex];
            this.Ball.css({ left: pos.left + 'px', top: pos.top + 'px' }).fadeIn();
            this.RestCount.css({ left: respos[0] + 'px', top: respos[1] + 'px' });
        }
    },
    SetSlugPosition: function () {
        var slugLeft = Math.floor(Math.random() * 251); //0-250
        this.Slug.css({ left: slugLeft + 'px' });
    },
    StartMoveRing: function (speed) {
        //        this.Ring[0].style.left = '0px';
        //        this.Ring[0].style.webkitTransition = 'left 2s linear';
        //        this.Ring[0].style.left = '320px';
        if (this.IsShooting) {
            return;
        }
        var that = this,
            left = parseInt($('#ring')[0].style.left);
        if ((left >= 281 && speed > 0) || (left <= 0 && speed < 0)) {
            speed = -speed;
        }
        left = left + speed;
        this.Ring[0].style.left = left + 'px';
        this.Timeout.ring = setTimeout(function () {
            that.StartMoveRing(speed);
        }, 10);
    },
    //射球
    ShootBall: function (pos) { //X方向初速度、Y方向初速度、时间、重力加速度、篮球绝对坐标[left,top]
        //        var vt = -pos.vy + pos.g * pos.t, //速度的方向，小于0为向上，大于0为向下
        var that = this,
            $ball = that.Ball;
        if (pos.top < 90)
            pos.fall = true;
        if (pos.fall && ((pos.top > 90 && that.Goal) || (pos.top > 165 && !that.Goal))) { //90为篮框的top偏移量
            var ballRemain = that.BallRemain[that.PositionIndex];
            if (that.Goal) {//投中了
                that.NetFlag(200);
                that.Score += ballRemain == 0 ? 2 : 1;
                that.SetScore(that.Score);
                $ball.addClass('shootDown')
                    .css({ left: '140px', top: '175px', zIndex: '9' }); //把球放在篮框中间,再垂直向下,篮球应在篮框后面
            }
            $ball.fadeOut(800, function () {
                that.IsShooting = false;
                that.SetBallPosition();
                if (that.PositionIndex == 5) {
                    that.ShowLoginBoard();
                    return;
                    //                    alert('游戏结束！你获得' + that.Score + '分!');
                    //                    that.Init();
                }
                that.SetSlugPosition();
                that.StartMoveRing(that.RingSpeed[that.PositionIndex]);
            });
            //clearTimeout(this.BallTimeout);
            //this.Ball.removeClass(pos.rotate); //篮球着地，停止转动

            return;
        }
        pos.t += 0.02; //0.02
        //Y方向
        pos.top = pos.top + (-pos.vy * pos.t + 0.5 * pos.g * Math.pow(pos.t, 2));
        this.Ball[0].style.top = pos.top + 'px';
        //        this.Ball[0].style.top = (0.5 * pos.g * Math.pow(pos.t, 2)-0.5*pos.t*(1.6+3*pos.g+pos.top)) + 'px';
        //X方向
        pos.left = pos.left + (pos.vx * pos.t);
        this.Ball[0].style.left = pos.left + 'px';
        //        this.Ball[0].style.left = (pos.left - pos.vx * pos.t) + 'px';

        this.BallTimeout = setTimeout(function () {
            that.ShootBall(pos);
        }, 10); //10
    },
    //避免直接赋值的话，初始设置也会跟着改变，相当于创建备份
    InitBall: function (origin) {
        var pos = {};
        for (var p in origin) {
            pos[p] = origin[p];
        }
        return pos;
    },
    //篮网飘动和篮板闪动
    NetFlag: function (speed) {
        var $net = this.Net,
            $blue = this.Blue,
            i = 1;
        flag();
        function flag() {
            $net.css('background-position-x', (-50 * i) + 'px');
            $blue.css('display', i % 2 == 1 ? 'block' : 'none');
            if (i == 0) {
                return;
            } else if (i == 3) {
                i = -1;
            }
            i++;
            setTimeout(flag, speed);
        }
    },
    //剩余时间板倒计时
    TimeBoard: function (sec) {
        var 
            min = Math.floor(sec / 60), //分钟
            s = sec % 60,
            that = this,
            de = Math.floor(s / 10), //秒钟十位
            un = s % 10; //秒钟个位
        this.$Time[0].css('background-position-x', (-21 * min) + 'px');
        this.$Time[1].css('background-position-x', (-21 * de) + 'px');
        this.$Time[2].css('background-position-x', (-21 * un) + 'px');
        if (sec <= 0) {//当为0秒时停止计时
            //            alert('游戏结束！你获得' + that.Score + '分!');
            //            that.Init();
            this.ShowLoginBoard();
            return;
        }
        //        that.Timeout.timeboard = setTimeout(function () {
        //            that.TimeBoard(--that.Time);
        //        }, 1000);
    },
    //计分板
    SetScore: function (score) {
        var s = score.toString(),
            that = this,
            de = '0',
            un = '0';
        switch (s.length) {
            case 1:
                un = s;
                break;
            case 2:
                de = s.charAt(0);
                un = s.charAt(1);
                break;
        }
        that.$Score[0].text(de);
        that.$Score[1].text(un);
    },
    //插入用户信息
    RankInsert: function (name, phone) {
        var score = this.TotalScore;
        $.ajax({
            url: "DataHandler.ashx",
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            data: 'dataType=2&name=' + name + '&phone=' + phone + '&score=' + score,
            dataType: "json",
            success: function (j) {
            }
        });
    },
    //载入排行榜
    RankLoad: function () {
        var that = this,
            index = this.PageIndex;
        Mock.mock("DataHandler.ashx?dataType=1&pageNow=" + index, {
            c:100,
            'l|10':[{
                r:'@increment',
                n:'@cname',
                's|30-200':1
            }]
        });
        $.ajax({
            url: "DataHandler.ashx",
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            data: 'dataType=1&pageNow=' + index,
            dataType: "json",
            success: function (json) {
                if (json) {
                    var count = parseInt(json.c);
                    that.PageCount = Math.ceil(count / 10);
                    var c = '';
                    $.each(json.l, function (i, s) {
                        c += '<div class="item"><div>第' + s.r + '名　' + s.n + '　得分：' + s.s + '分<span>' + that.GetNickName(+s.s) + '</span></div></div>';
                    });
                    $('#list').html(c);
                    that.$game.hide();
                    that.$rankBoard.show();
                }
            }
        });
    },
    //登录框，结算、小计（在射完位置5的球或者时间到时触发）
    ShowLoginBoard: function () {
        clearTimeout(this.Timeout.timeboard);
        clearTimeout(this.Timeout.ring);
        this.Shoot.hide();
        //累计到总分
        this.TotalScore += this.Score;
        var $lg = this.$login,
            $or = this.$overRound,
            s = this.Score,
            i = this.RoundIndex,
        //            text = '你在3GNBA全明星三分赛预赛成绩是：' + s + '分！',
            name = this.GetNickName(this.TotalScore); //根据分数获取称号
        $('#shareContent').val(this.ShareString.join(name)); //默认
        this.$nickName.text(name); //设置称谓
        if (i < 6) {
            if ((i == 1 && s < 20) || (i == 2 && s < 22) || (i == 3 && s < 24) || (i == 4 && s < 26) || (i == 5 && s < 30)) {
                if (i == 1) {   //要闯完第一关才给予载入排行榜
                    $or.find('div.header').text('对不起！你此关分数' + s + '分，总分' + this.TotalScore + '分，闯关失败！').end().show();
                } else {
                    var text = '对不起！你此关分数' + s + '分，总分' + this.TotalScore + '分，闯关失败！';
                    $.ajax({
                        url: "DataHandler.ashx",
                        type: "GET",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: 'dataType=3&score=' + this.TotalScore,
                        dataType: "json",
                        success: function (rank) {
                            if (rank > 0) {
                                text += '(排第' + rank + '名)';
                                $lg.find('div.header').text(text).end().show();
                            }
                        }
                    });
                }
                //                text += '很遗憾你没能进入决赛！';
                //                this.$btnOr.text('重新开始');
            } else {
                if (i == 5) {
                    text = '恭喜你战胜全部对手，闯关成功！总分' + this.TotalScore + '分';
                    $.ajax({
                        url: "DataHandler.ashx",
                        type: "GET",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: 'dataType=3&score=' + this.TotalScore,
                        dataType: "json",
                        success: function (rank) {
                            if (rank > 0) {
                                text += '(排第' + rank + '名)';
                                $lg.find('div.header').text(text).end().show();
                            }
                        }
                    });
                } else {
                    //显示下一关
                    this.$playerPanel.find('>div').attr('class', this.PlayerClass[i]).end()
                    .find('.text').html(this.PlayerText[i]).end().show();
                }

                //                text += '恭喜你顺利闯进了决赛！';
                //                this.$btnOr.text('继续争冠');
            }
            //            $or.find('div.header').text(text);
            //            $or.show();
        } else {
            //            $.ajax({
            //                url: "DataHandler.ashx",
            //                type: "GET",
            //                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            //                data: 'dataType=3&score=' + s,
            //                dataType: "json",
            //                success: function (rank) {
            //                    if (rank > 0) {
            //                        if (rank == 1) {
            //                            text += '恭喜你成为本届三分大赛首位三分王！';
            //                        } else {
            //                            text += '排第' + rank + '名！';
            //                        }
            //                        $lg.find('div.header').text(text);
            //                        $lg.show();
            //                    }
            //                }
            //            });

        }
    },
    //根据分数获取称谓
    GetNickName: function (s) {
        var nick = ['菜鸟射手小李广', '神射将军太史慈', '神射无敌黄忠', '无双箭吕布', '神箭手哲别', '飞将军李广', '射日人王后羿', '上帝'],
            name = '无';
        if (s >= 30 && s < 51) {
            name = nick[0];
        } else if (s > 50 && s <= 70) {
            name = nick[1];
        } else if (s > 70 && s <= 90) {
            name = nick[2];
        } else if (s > 90 && s <= 100) {
            name = nick[3];
        } else if (s > 100 && s <= 110) {
            name = nick[4];
        } else if (s > 110 && s <= 120) {
            name = nick[5];
        } else if (s > 120 && s <= 140) {
            name = nick[6];
        } else if (s > 140) {
            name = nick[7];
        }
        return name;
    },
    Restart: function () {
        clearTimeout(this.Timeout.timeboard);
        clearTimeout(this.Timeout.ring);
        this.TotalScore = 0;
        this.RoundIndex = 0;
        this.$playerPanel.find('>div').attr('class', this.PlayerClass[this.RoundIndex]).end()
                    .find('.text').html(this.PlayerText[this.RoundIndex]).end().show();
    }
};

$(function () {
    $('#shareContent').val(Game.ShareString.join('菜鸟射手小李广')); //默认
    //开始游戏
    Game.$start.click(function () {
        Game.$startPanel.hide();
        Game.$playerPanel.show();
        //Game.Init();
    });
    //确定（开始闯关）
    Game.$playerOk.click(function () {
        Game.$playerPanel.hide();
        var speed = ++Game.RoundIndex+1;  //一关一个速度
        Game.Init(0, [speed, speed, speed, speed, speed]);
    });
    Game.$ok.click(function () {
        var txtNick = $('#txtNick'),
            txtPhone = $('#txtPhone');
        if (txtNick.val().length > 0 && txtNick.val().length < 7 && txtPhone.val().length > 0 && txtPhone[0].checkValidity()) {
            Game.RankInsert(txtNick.val(), txtPhone.val());
        }
        txtNick.val('');
        txtPhone.val('');
        Game.$login.hide();
    });
    Game.Retry.click(function () {
        Game.Restart();
    });
    Game.Shoot.click(function () {
        if (!Game.IsShooting) {
            Game.IsShooting = true;
            clearTimeout(Game.Timeout.ring);
            var pos = Game.BallPosition[Game.PositionIndex], //获取篮球位置实体
            	rleft = parseInt(Game.Ring[0].style.left),
            	sleft = parseInt(Game.Slug[0].style.left),
            	ldst = rleft - sleft,
            	rdst = (rleft + Game.RingWidth) - (sleft + Game.SlugWidth),
                p = Game.InitBall(pos); //复制得到实体的副本
            //alert(ldst + ',' + rdst);

            if (ldst >= 0 && rdst <= 0) {
                Game.Goal = true;
            } else {
                //alert(Game.RingWidth + ',' + Game.SlugWidth + ',' + rleft + ',' + sleft + ',' + ldst + ',' + rdst);
                Game.Goal = false;
                var lostCount = p.lost.length,
                    i = Math.floor(Math.random() * lostCount);
                p.vx = p.lost[i].x;
                p.vy = p.lost[i].y;
                //                if (ldst < 0) {//小力了
                //                    //                    p.vx -= f * 0.5; //向左偏移，让其肯定不中
                //                    //                    p.vx *= (rleft / sleft);
                //                    //                    p.vy *= (rleft / sleft);
                //                    p.vx = p.min[0];
                //                    p.vy = p.min[1];
                //                } else if (rdst > 0) {//大力了
                //                    //                    p.vx += f * 0.3; //向右偏移，让其肯定不中
                //                    //                    p.vx *= (1 + (sleft + Game.SlugWidth) / (rleft + Game.RingWidth));
                //                    //                    p.vy *= (1 + (sleft + Game.SlugWidth) / (rleft + Game.RingWidth));
                //                    p.vx = p.max[0];
                //                    p.vy = p.max[1];

                //                }
            }
            Game.ShootBall(p); //射球
            Game.Ball.addClass(p.rotate); //让球旋转
            Game.BallRemain[Game.PositionIndex]--; //在当前位置减去一个球
            //            var ballRemain = Game.BallRemain[Game.PositionIndex];
            //            Game.RestText.text(ballRemain); //显示当前位置剩余的球数
        }
    });
    Game.$rank.click(function () {
        Game.PageIndex = 1;
        Game.RankLoad();
    });
    Game.$prev.click(function () {
        if (Game.PageIndex > 1) {
            Game.PageIndex--;
            Game.RankLoad();
        }
    });
    Game.$next.click(function () {
        if (Game.PageIndex < Game.PageCount) {
            Game.PageIndex++;
            Game.RankLoad();
        }
    });
    //重新开始
    Game.$btnOr.click(function () {
        Game.$overRound.hide();
        Game.Restart();
        //        switch (Game.$btnOr.text()) {
        //            case '重新开始':
        //                Game.Init();
        //                break;
        //            case '继续争冠':
        //                Game.RoundIndex = 2;
        //                Game.Init(Game.Score, [2, 3, 4, 5, 6]);
        //                break;
        //        }

    });
    $('#closeRank').click(function () {
        Game.$rankBoard.hide();
        Game.$game.show();
    });
});

