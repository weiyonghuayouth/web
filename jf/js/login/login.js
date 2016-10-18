/**
 * Created by Administrator on 2016/4/26.
 */

$(function(){
    //先退出登陆状态
    $.ajax({
        type: "POST",
        url: URL + 'zh/login/0/logout.do',
        cache: false,
        success: function(msg){
        }
    });

    //加载头部
    ajaxHtml($("#jf-top"));


    // 为 #login-form 绑定onkeydown事件监听是否按了回车键
    $("#login-form").keydown(function(e){
        if (e.keyCode === 13){ // 按了回车键
            $("#loginBtn").trigger("click");
        }
    });

    // 登录验证
    $("#loginBtn").click(function(){
        var oCode = $("#login-form").find('input[name="code"]').val();
        var oPassWord = hex_md5($("#login-form").find('input[name="password"]').val());
        var oPassWord1 = $("#login-form").find('input[name="password"]').val();
        var oUrl = URL+'zh/login/0/login.do';
        var oRcc = $(".login-yzm").find('input[name="validateCode"]').val();

        var oData = {
            "code":oCode,
            "password":oPassWord,
            "inputValidateCode":oRcc,
            "login_type":"weixincode"
        };
        var errorUn = $(".error-userName");
        var errorPw = $(".error-password");
        var errorRcc = $(".error-reCaptcha");

        if ($.trim(oCode) == ""){
            errorUn.html("用户名不能为空！");
            $("#login-form").find('input[name="code"]').focus();
        }
        if ($.trim(oCode) !== ""){
            errorUn.html("");
        }
        if ($.trim(oPassWord1) == ""){
            errorPw.html("密码不能为空！");
            $("#login-form").find('input[name="password"]').focus();
        }
        if ($.trim(oPassWord1) !== ""){
            errorPw.html("");
        }
        if ($.trim(oRcc) == ""){
            errorRcc.html("授权码不能为空！");
            $(".login-yzm").find('input[name="validateCode"]').focus();
        }
        if ($.trim(oRcc) !== ""){
            errorRcc.html("");
        }
        if ($.trim(oRcc) !== "" && $.trim(oPassWord1) !== "" && $.trim(oCode) !== ""){
            // 发送登录的异步请求
            $.ajax({
                type: 'POST',
                url: oUrl,
                cache: false,
                data:oData,
                dataType:'json',
                success: function(msg){
                    if(msg.state == 0){
                        window.location.href = SEARCH_INDEX;
                    }
                    function possWS(id,html){
                        id.html(html);
                        $("#login-form").find('input[name="password"]').val("");
                    }
                    (msg.state == 1101)?possWS(errorUn,"账户不存在"):errorUn.html("");
                    (msg.state == 1102)?possWS(errorPw,"密码错误！"):errorPw.html("");
                    (msg.state == 1109)?possWS(errorRcc,"授权码错误！"):errorRcc.html("");
                    if(msg.state == 1100){
                        $(".initial-password").show().html("初始密码："+msg.msg+"（请登陆更改）");
                    }
                }

            })
        }

    });

    //验证码替换程序
    //function loadImg(){
    //    var ransrc = URL+'zh/login/0/getcode.do?s='+Math.random();
    //    $("#loginImg").attr("src",ransrc);
    //}
    //
    //$("#click-img").click(function(){
    //        loadImg();
    //    });
    //$("#loginImg").click(function(){
    //    loadImg();
    //});


});


