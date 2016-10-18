var URL = '/XUserSystem/';
var HOST = "118.123.246.16";
var INDEX = "/html/login/index.html";// 登陆页
var SEARCH_INDEX = "/html/search/index.html";//搜索页首页
var SEMINAR_INDEX = "/html/subject/index.html";//专题页
var Search_History = "/html/subject/SearchHistory.html";//历史搜索页
var Journal_Index = "/html/subject/journal.html";//简报页
var Favorites_Index = "/html/subject/Favorites.html";//收藏页
var SEARCH_HISTORY = "SEARCH_HISTORY";
var SIMPLE_SEARCH_TEXT = "SIMPLE_SEARCH_TEXT";
var COOKIE_EXPIRE_DAYS = 30; // cookie失效时间
var SEPARATOR = "***";
var CATALOG_IF = "";  // 专题 通过判断变量显示内容
var url_param = getUrlItem();   //取URl参数
var DAY_CHECKED = "-7"; //统计图中选择日期变化的变量
var ID_CHEKED = ""; //统计图中 设置全局id 控制选择
var CLICK_Journal = ""; //期刊分期选中项id
var PAGE_INDEX = 1 ;// 刷新当前页
var TIMEOUT = 20000;//超时时间

/**
 *placeholder   兼容ie
 */
function placeholder(){
    var JPlaceHolder = {
        //检测
        _check : function(){
            return 'placeholder' in document.createElement('input');
        },
        //初始化
        init : function(){
            if(!this._check()){
                this.fix();
            }
        },
        //修复
        fix : function(){
            jQuery(':input[placeholder]').each(function(index, element) {
                var self = $(this), txt = self.attr('placeholder');
                self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
                var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
                var holder = $('<span></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top,textIndent:10,fontSize:16, height:h,lineHeight:h+'px', paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
                self.focusin(function(e) {
                    holder.hide();
                }).focusout(function(e) {
                    if(!self.val()){
                        holder.show();
                    }
                });
                holder.click(function(e) {
                    holder.hide();
                    self.focus();
                });
            });
        }
    };
//执行
    jQuery(function(){
        JPlaceHolder.init();
    });
}
/**
 * 异步调用
 * @param url url
 * @param dataType 返回数据格式
 * @param data 数据
 * @param is_logout 错误是否退出登陆
 * @param timeout 超时时间
 * @param callbackok 成功回调
 * @param callbackerror 错误回调，不设置默认错误处理
 */
function $p(url,dataType, data, is_logout, timeout, callbackok, callbackerror) {
    $j(url,dataType,data,true,true,is_logout,timeout,callbackok,callbackerror);
}

/**
 * 异步调用
 * @param url url
 * @param dataType 返回数据格式
 * @param data 数据
 * @param is_async 是否异步
 * @param is_post 是否是post请求
 * @param is_logout 错误是否退出登陆
 * @param timeout 超时时间
 * @param cbok 成功回调
 * @param cberr 错误回调，不设置默认错误处理
 */
function $j(url,dataType, data, is_async, is_post, is_logout, timeout, cbok, cberr) {
    $.ajax({
        type: is_post ? 'post' : 'get',
        async: is_async,
        url: url,
        cache: false,
        data: data,
        dataType: dataType,
        timeout: timeout,
        beforeSend: function () {
            LOADING();
        },
        success: function (msg) {
            layer.closeAll();
            if (msg.state == 0) {
                cbok(msg);
            } else if (msg.state == -300 || msg.state == -400) {
                if (is_logout) {
                    layer.alert(msg.msg, {
                        skin: "jf-dialog",
                        closeBtn: 0
                    }, function () {
                        logOut();
                    });
                } else {
                    if (isNullObj(cberr)) {
                        Msg(msg.msg)
                    } else {
                        if (!cberr(msg)){
                            //  对方并没有处理，这个地方处理
                            Msg(msg.msg)
                        }else{
                            cberr(msg);
                        }
                    }
                }
            } else {
                if (isNullObj(cberr)) {
                    Msg(msg.msg)
                } else {
                    if (!cberr(msg)){
                        //  对方并没有处理，这个地方处理
                        Msg(msg.msg)
                    }
                }
            }
        }
    });
}

function Msg(msg) {
    layer.closeAll();
    //消息框
    layer.alert(msg, {
        skin: "jf-dialog",
        closeBtn: 0
    });
}


function Msgok(msg,cbok) {
    layer.closeAll();
    //消息框
    layer.alert(msg, {
        skin: "jf-dialog",
        closeBtn: 0
    },function(){
        cbok
    });
}

function Msgyn(msg,cby,cbn) {
    layer.closeAll();
    //消息框
    layer.alert(msg, {
        skin: "jf-dialog",
        closeBtn: 0,
        btn: ['确定', '取消']
    });
}


function isNullStr(arg) {
    if (arg == null || arg == "" || typeof(arg) == "undefined") {
        return true;
    }
    return false;
}


function isNullObj(arg) {
    if (arg == null || typeof(arg) == "undefined") {
        return true;
    }
    return false;
}

// 退出状态
function logOut() {
    $p( URL + 'zh/login/0/logout.do',"json","",false,TIMEOUT,function ok(mag){
        window.location.href = INDEX;
    },function error(is,mag){
        return false;
    });
}

//进度 提示
function LOADING() {
    layer.open({
        type: 3,
        shade: 0.2,
        icon: 2,
        time: 30000
    })
}
/**
 * 用户信息
 */
function UserInformation(){
    layer.open({
        title: '用户信息',
        type: 1,
        skin: 'jf-dialog', //样式类名
        shift: 2,
        area: ["600px", "350px"],
        shadeClose: true, //开启遮罩关闭
        content: $('#UserInformation'),
        btn: ['关闭'],
        success: function(){
            var oUrl =URL + 'zh/user/getInfo.do';
            var inData = {
                token:1
            };
            $.ajax({
                type: "POST",
                url:oUrl,
                cache: false,
                data:inData,
                dataType: 'json',
                timeout: 20000,
                beforeSend: function () {
                },
                error: function () {
                },
                success: function (msg) {
                    if(msg.state == 0){
                        var oHtml = template("UserInformation-tpl", msg);
                        $("#UserInformation").html(oHtml);
                    }
                    if(msg.state == -300 || msg.state == -400){
                        layer.alert(msg.msg, {
                            skin: "jf-dialog",
                            closeBtn: 0
                        }, function () {
                            logOut();
                        });
                    }

                }
            });
        }
    });

}
/**
 * 修改密码
 */
function passwordRevise(){
    layer.open({
        title: '修改密码',
        type: 1,
        skin: 'jf-dialog', //样式类名
        shift: 2,
        area: ["600px", "350px"],
        shadeClose: true, //开启遮罩关闭
        content: $('#passwordDiv'),
        btn: ['确认', '取消'],
        yes: function(){
            var oldpas =$("#oldPassword").val();
            var newpas =$("#newPassword").val();
            var renewpas =$("#newPasswordaAgain").val();
            var ohtml =$("#Passwordmsg");
            var url =URL + 'zh/user/updatepassword.do';
            if (isNullStr(oldpas)) {
                ohtml.html("请输入原密码！");
                return false
            }
            if (isNullStr(newpas)) {
                ohtml.html("请输入新密码！");
                return false
            }
            if (isNullStr(renewpas)) {
                ohtml.html("请再次输入新密码！");
                return false;
            }
            if (newpas != renewpas) {
                ohtml.html("两次密码输入不一致！");
                return false;
            }
            var oData = {
                token:1,
                oldPassword: oldpas,
                newPassword: newpas
            };
            $p(url,'json',oData, true,TIMEOUT,function ok (msg){
                layer.alert('修改成功.请重新登录！',{
                    skin:"jf-dialog",
                    closeBtn: 0
                },function(){
                    layer.closeAll();
                    window.location.href = INDEX;
                });
            });
        },
        end:function(){
            $("#oldPassword").val("");
            $("#newPassword").val("");
            $("#newPasswordaAgain").val("");
            $("#Passwordmsg").html("");
        }
    });
}

//全局提示

function Popup(body) {
    $(".Popup-box").fadeIn(300).html(body);
    setTimeout('$(".Popup-box").fadeOut(300)', 3000)
}
/**
 * 获取数组
 *
 * @param selector 选择器 参数 如   #id a
 * @param field 要取的 标签 属性 名
 * @returns {Array}
 */
function eachToArray(selector, field) {
    var array = new Array;
    $(selector).each(function (i, val) {
        array.push($(this).attr(field));
    });

    return array;
}

// 判断是否为空 或未定义
function isNull(arg) {
    if (arg == null || arg == "" || typeof(arg) == "undefined") {
        return true;
    }
    return false;
}

/**
 * 模板 赋值
 * @param divId
 * @param templateId
 * @param json
 */
function setTemplate(divId, templateId, json) {
    // 替换赋值
    document.getElementById(divId).innerHTML = template(templateId, json);
}

/**
 * 获取url定义参数 返回 map  url_param为全局调用
 */
function getUrlItem() {
    var map = new Map();
    var params = location.search.substring(1);
    var paramList = [];
    if (params.length > 0) {
        if (params.indexOf("&") >= 0) {
            paramList = params.split("&");
        } else {
            paramList[0] = params;
        }
        for (var i = 0, listLength = paramList.length; i < listLength; i++) {
            var p = paramList[i].split("=")

            if (p.length > 1) {
                map.put(p[0], p[1]);
            } else {
                map.put(p[0], "");
            }
        }
    }
    return map;
}

//ajax动态加载页面函数  start--------------------------------->
function ajaxHtml(obj, fn) {
    if (obj) {
        var oBj = obj;
    } else {
        var oBj = $(".ajaxHtml");
    }
    oBj.each(function () {
        var oUrl = $(this).attr("url");
        $(this).load(oUrl, function () {
            if (fn) {
                fn()
            }
        });
    });
}

//ajax动态加载页面函数  end----------------------------------->

//左侧树定制函数 start ------------------------------>
function treeLeft() {
    $("#tree-menu dt").click(function () {
        var obj = $(this);
        var oParent = $(this).parent();
        var oThisDd = $(this).parent().find("dd");
        //只能一个展开
            oThisDd.slideDown("fast");
            $("#tree-menu").find("dd").not(oThisDd).slideUp("fast");
            oParent.addClass("dl_on");
            $("#tree-menu dl").not(oParent).removeClass("dl_on");
    });
}

//左侧树定制函数 end  ------------------------------->


//获取url的值-------------------------
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
//-----------------------------------


//获取数据的ajax----------------------
function jfAjax(url, fn) {
    $.ajax({
        type: "POST",
        url: url,
        cache: false,
        dataType: "json",
        success: function (msg) {
            if (fn) {
                fn(msg);
            }
        }

    })

}

//获取数据的ajax----------------------


//快速ajax---------------------------
function fastJfAjax(url, data, successfn, errorfn) {
    $.ajax({
        type: "POST",
        url: url,
        cache: false,
        data: data,
        dataType: "json",
        success: function (msg) {
            if (successfn) {
                successfn(msg);
            }
        },
        error: function (ms) {
            if (errorfn) {
                errorfn(msg);
            }
        }
    })
}
//快速ajax---------------------------
/**
 *
 * 从cookie中获取数据
 *
 * @author <a href="mailto:wentian.he@qq.com">hewentian</a>
 * @date 2016年5月16日 下午7:14:06
 *
 * @param id 一般为用户的id
 * @param type 缓存的类型
 * @return 一个数组，其中的cookie元素K-V在数组中以#分隔
 *
 */
function getXCookie(id, type) {
    //得到本域下的所有cookie  -- "id_type_num_title, hwt_history_1_ab=828; hwt_history_2_cd=lisi"
    var cookies = document.cookie;
    if (cookies.length == 0) {
        return "";
    }

    var keyPrefix = id + "_" + type; // 区分用户和缓存的数据类型
    var arrCookie = cookies.split(";");
    var returnArray = new Array();

    for (var i = 0, len = arrCookie.length; i < len; i++) {
        var ac = arrCookie[i].split("=");
        var acKey = ac[0];
        acKey = $.trim(acKey);
        if (acKey.indexOf(keyPrefix) != -1) {
            acKey = acKey.substr(keyPrefix.length + 1);
            if (acKey != "currentIndex") {
                acKey = decodeURI(acKey.substr(acKey.indexOf("_") + 1));
                var acValue = decodeURI(ac[1]);
                returnArray.push(acKey + "#" + acValue);
            }
        }
    }

    // 将数组倒序排列
    returnArray.reverse();

    return returnArray;
}
/**
 * 获取数据
 * @param id
 * @param type
 * @param cname
 * @returns {*}
 */
function getXCookieByKey(id, type, cname) {
    //得到本域下的所有cookie  -- "id_type_num_title, hwt_history_1_ab=828; hwt_history_2_cd=lisi"
    var cookies = document.cookie;
    if (cookies.length == 0) {
        return "";
    }

    var ret = getXCookie(id, type);
    for (var i = 0; i < ret.length; i++) {
        var d = ret[i].split("#");
        if (d[0] == cname) {
            return d[1];
        }
    }

    return "";
}


/**
 *
 * 从cookie中获取数据，根据指定的name来获取
 *
 * @author <a href="mailto:wentian.he@qq.com">hewentian</a>
 * @date 2016年5月16日 下午7:14:06
 *
 * @param c_name cookie的名字
 * @return 一个值
 *
 */
function getXCookie2(c_name) {
    c_name = encodeURI(c_name);
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return decodeURI(document.cookie.substring(c_start, c_end))
        }
    }

    return "";
}

/**
 *
 * 向cookie中缓存数据
 *
 * @author <a href="mailto:wentian.he@qq.com">hewentian</a>
 * @date 2016年5月16日 下午7:22:06
 *
 * @param id 一般为用户的id
 * @param type 缓存的类型
 * @param c_name 要缓存的key
 * @param value 要缓存的value
 * @param expiredays 该cookie的有效时间，为日, 可为空，为空则不设置时间限制
 * @param maxSize 该type的cookie最多可以存多少个, 整型值
 *
 */
function setXCookie(id, type, c_name, value, expiredays, maxSize) {
    var cookies = document.cookie;
    var keyPrefix = id + "_" + type;

    // 如果是历史搜索，则要去重
    if (type == SEARCH_HISTORY) {
        if (isXCookieContains(c_name)) {
            return;
        }
    }

    var currentIndex = 0; // 当前类型的下标数，从0开始，这里假设为0
    var currentIndexStr = keyPrefix + "_currentIndex=";
    var cStart = cookies.indexOf(currentIndexStr);
    var cEnd = 0;
    if (cStart != -1) {
        cStart = cStart + currentIndexStr.length;
        cEnd = cookies.indexOf(";", cStart);
        if (cEnd == -1) {
            cEnd = cookies.length;
        }

        currentIndex = parseInt(cookies.substring(cStart, cEnd));
        currentIndex += 1;
    }

    if (maxSize == null) {
        maxSize = 0;
    }

    if (type == SEARCH_HISTORY && maxSize > 0 && currentIndex > maxSize) { // 历史记录最多存maxSize个
        // 删除之前的
        deleteXCookieHistory(keyPrefix + "_", (currentIndex - maxSize), 3);
    }

    var cookieString = keyPrefix + "_" + currentIndex + "_" + encodeURI(c_name) + "=" + encodeURI(value);
    if (expiredays != null) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        cookieString += "; expires=" + exdate.toGMTString();
    }

    document.cookie = cookieString + "; path=/";

    // 设置当前值
    document.cookie = currentIndexStr + currentIndex + "; path=/";
}

/**
 *
 * 向cookie中缓存数据
 *
 * @author <a href="mailto:wentian.he@qq.com">hewentian</a>
 * @date 2016年5月16日 下午7:22:06
 *
 * @param c_name 要缓存的key
 * @param value 要缓存的value
 * @param expiredays 该cookie的有效时间，为日, 可为空，为空则不设置时间限制
 *
 */
function setXCookie2(c_name, value, expiredays) {
    var cookieString = encodeURI(c_name) + "=" + encodeURI(value);

    if (expiredays != null) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        cookieString += "; expires=" + exdate.toGMTString();
    }
    document.cookie = cookieString + "; path=/";
}

/**
 *
 * 判断cookie中是否含有这个name
 *
 * @author <a href="mailto:wentian.he@qq.com">hewentian</a>
 * @date 2016年5月21日 下午2:14:06
 *
 * @param cname cookie的名字
 * @return true/false
 *
 */
function isXCookieContains(cname) {
    cname = encodeURI(cname);
    var cookies = document.cookie;
    if (cookies.length == 0) {
        return false;
    }

    var keyPrefix = getXCookie2("USER_ID") + "_" + SEARCH_HISTORY; // 区分用户和缓存的数据类型
    var arrCookie = cookies.split(";");

    for (var i = 0, len = arrCookie.length; i < len; i++) {
        var ac = arrCookie[i].split("=");
        var acKey = ac[0];
        acKey = $.trim(acKey);
        if (acKey.indexOf(keyPrefix) != -1) {
            acKey = acKey.substr(keyPrefix.length + 1);

            if (acKey != "currentIndex") {
                acKey = acKey.substr(acKey.indexOf("_") + 1);

                if (acKey == cname) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 *
 * 删除cookie中指定前缀的cookie
 *
 * @author <a href="mailto:wentian.he@qq.com">hewentian</a>
 * @date 2016年5月21日 下午2:14:06
 *
 * @param cnamePrefix cookie的名字前缀
 * @return true/false
 *
 */
function deleteXCookieHistory(cnamePrefix, max, idx) {
    var cookies = document.cookie;
    if (cookies.length == 0) {
        return false;
    }

    if (idx == null) {
        idx = -1;
    }

    if (max == null) {
        max = 0;
    }

    if (max < 1) {
        return false;
    }

    var arrCookie = cookies.split(";");
    var find = false;

    for (var i = 0, len = arrCookie.length; i < len; i++) {
        var ac = arrCookie[i].split("=");
        var acKey = ac[0];
        acKey = $.trim(acKey);
        find = false;
        if (acKey.indexOf(cnamePrefix) > -1) {
            if (idx > -1) {
                if (acKey.split("_").length <= idx) {
                    find = false;
                } else if (parseInt(acKey.split("_")[idx]) < max) {
                    find = true;
                }
            } else {
                find = true;
            }
        }

        if (find) {
            var date = new Date();
            date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
            document.cookie = acKey + "=; expires=" + date.toGMTString() + "; path=/";
        }
    }

    return false;
}

/**
 * 格式化日期
 *
 * @author <a href="mailto:wentian.he@qq.com">hewentian</a>
 * @date 2016年5月18日 下午3:15:26
 *
 * @param formatStr 格式化字符串，用法如下, new Date().Format('yyyy-MM-dd HH:mm:ss')
 */
Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    var month = this.getMonth() + 1;
    str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
    str = str.replace(/M/g, month);

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
}

/**
 *
 * 获取传进来的很长的URL串中的域名部分
 *
 * @author <a href="mailto:wentian.he@qq.com">hewentian</a>
 * @date 2016年5月21日 下午12:25:10
 *
 * @param url 要截取的URL
 *
 */

function getUrlDomain(url) {
    var startIndex = 0;
    if (url.startsWith("http://")) {
        startIndex = 7
    } else if (url.startsWith("https://")) {
        startIndex = 8
    }
    var endIndex = url.indexOf("/", startIndex);
    url = url.substr(0, endIndex);
    return url;
}