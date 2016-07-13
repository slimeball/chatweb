Date.prototype.Format = function(fmt){
    var o = {   
        "M+" : this.getMonth()+1,                 //月份   
        "d+" : this.getDate(),                    //日   
        "h+" : this.getHours(),                   //小时   
        "m+" : this.getMinutes(),                 //分   
        "s+" : this.getSeconds(),                 //秒   
        "q+" : Math.floor((this.getMonth()+3)/3), //季度   
        "S"  : this.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;   
};
$(function () {
    var _editArea = $('#editArea'),
        urlargument = window.location.search,
        uid = urlargument.split('&')[0].substr(8),
        wishWallid = urlargument.split('&')[1].substr(11);

    //显示隐藏发送按钮
    var _editAreaInterval;
    $('#editArea').focus(function () {
        var _this = $(this), html;
        _editAreaInterval = setInterval(function () {
            html = _this.html();
            if (html.length > 0) {
                $('#web_wechat_pic').hide();
                $('#btn_send').show();
            } else {
                $('#web_wechat_pic').show();
                $('#btn_send').hide();
            }
        }, 200);
    });

    $('#editArea').blur(function () {
        clearInterval(_editAreaInterval);
    });

    //显示隐藏表情栏
    $('.web_wechat_face').click(function () {
        $('.box_ft_bd').toggleClass('hide');
        resetMessageArea();
    });

    //切换表情主题
    $('.exp_hd_item').click(function () {
        var _this = $(this), i = _this.data('i');
        $('.exp_hd_item,.exp_cont').removeClass('active');
        _this.addClass('active');
        $('.exp_cont').eq(i).addClass('active');
        resetMessageArea();
    });

    //选中表情
    $('.exp_cont a').click(function () {
        var _this = $(this);
        //var html = '<img class="' + _this[0].className + '" title="' + _this.html() + '" src="../../images/spacer.gif">';
        var html = '<span>['+_this.attr('title')+']</span>'; 
        _editArea.html(_editArea.html() + html);
        $('#web_wechat_pic').hide();
        $('#btn_send').show();
    });

    $('.btn_send').on('click',function(){
        sendMsg($('.editArea').text())
        $('.editArea').text('')
        resetMessageArea();
    })

    resetMessageArea();

    //发送消息
    function sendMsg(str) {
        var curtime = new Date().Format("hh:mm");
        //获取头像
        $.ajax({
            type: "get",
            dataType: "json",
            url:'/wishwall/wx/getUserAvatar.koala',
            data:{
                userid:uid
            }
        }).done(function(rep){
            var msgdom = '<div class="message me"> <img class="avatar" src="'+rep.data+'" /> <div class="content"> <div class="nickname"><span class="time">'+curtime+'</span></div> <div class="bubble bubble_primary right"> <div class="bubble_cont"> <div class="plain"> <pre>'+str+'</pre> </div> </div> </div> </div> </div>';
            $('#messageList').append(msgdom);
            $('#messageList').scrollTop( $('#messageList')[0].scrollHeight );
        })
        $.ajax({
            type: "post",
            dataType: "json",
            url:'/wishwall/wx/addWishWallUser.koala',
            data:{
                userid:uid,
                wishWallId:wishWallid,
                content:str
            }
        }).done(function(rep){

        })
    }

    function resetMessageArea() {
        $('#messageList').animate({ 'scrollTop': 999 }, 500);
    }

});
