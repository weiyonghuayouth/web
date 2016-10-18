/**
 * Created by Administrator on 2016/5/24.
 */

function chart_init() {
    //准备好框架以免下面调用没有东西
    //加载头部
    ajaxHtml($("#jf-top"));
    //加载导航栏
    ajaxHtml($("#jf-menu"));
    // 添加专题组
    zhuanti_menu_Ajax();
    //  添加检索历史
    //jiansuolishi_menu();
    // 点击树显示隐藏功能
    treeLeft();
}

/**
 * 获取专题列表
 */
function zhuanti_menu_Ajax(){
    $.ajax({
        type: "POST",
        async: false,
        url : URL+'zh/subject/0/gettree.do',
        cache : false,
        data :　{"token": "gettree"},
        dataType : "json",
        success : function(data){
            if(data.state==0){
                var oData = data.data[0];
                $("#group").attr("idname",oData.groupId);
                $("#group").find("dt").html(oData.groupName);
                var oHtml = template("group-tpl",oData);
                $("#group").find("dd").html(oHtml);
                $("#group").attr("mount",true);
                if (url_param.get("type") == "chart" ||url_param.get("type") ==null ){
                    //showdata
                    $("#group").addClass("dl_on");
                    var id = url_param.get("id");
                    var allId = $("#group dd a");
                    var idgroup = eachToArray(allId,"idname");
                    for(var i=0; i<idgroup.length;i++){
                        if(id == idgroup[i]){
                            $("#group").find(".tree-a").eq(i).click()
                        }
                    }
                    if (id ==null || id == ""){
                        $("#group").find(".tree-a").eq(0).click();
                    }

                }
            }else{
                layer.alert(data.msg,{
                    skin:"jf-dialog",
                    closeBtn: 0,
                },function(){
                    window.location.href =INDEX;
                });
            }
        },
        error : function(data) {
            layer.alert('找不到数据，请检查您的网络',{
                skin:"jf-dialog",
                closeBtn: 0,
            })
        }
    })
}

/**
 * 获取检索历史列表
 */
function jiansuolishi_menu() {
    if (url_param.get("type") == "history") {
        var key = hex_md5(url_param.get("data"));
        var param = decodeURI(url_param.get("data"));
        var data = JSON.parse(param);
        //存储
        setXCookie(getXCookie2('USER_ID'), SEARCH_HISTORY, key, param, null, 10);
        historyytree(key);
    }

    var historyList = getXCookie(getXCookie2('USER_ID'), SEARCH_HISTORY);
    var obj = {};
    obj.datas = [];
    for (var i = 0; i < historyList.length; i++) {
        var row = {};
        row.key = historyList[i].split("#")[0];
        row.data = JSON.parse(decodeURI(historyList[i].split("#")[1]));
        obj.datas.push(row);
    }
    var historyHtml = template("group-history-tpl", obj);
    $("#group-history").html(historyHtml);
}
/**
 * 鼠标点击事件
 */
function chartClick(obj){
    var oThis = $(obj);
    $("#tree-menu").find('.tree-a').removeClass("a_on");
    oThis.addClass("a_on");
    ID_CHEKED = oThis.attr("idname");

    starajax(DAY_CHECKED,ID_CHEKED);
}
function checkDay(day){
    var oFa = $(day).find(".fa");
    var pFa = $(day).parents('.my-selectData').find('.fa');
    pFa.removeClass("fa-check-square-o");
    pFa.addClass("fa-square-o");
    oFa.removeClass("fa-square-o");
    oFa.addClass("fa-check-square-o");

    DAY_CHECKED = $(day).attr('value');
    starajax(DAY_CHECKED,ID_CHEKED);
}

function starajax(day,Id) {

    //接口 地址
    var url =URL+ "zh/subject/statistics.do?token=1";

    //专题id
    var subjectId =Id;//获取主页左边树选中id值
    if(isNull(subjectId)){
        return;
    }

    //设置每个统计图显示数量
    var updatetimeSize = Math.abs(day);
    var sizeSize = 9;
    var countrySize = 20;
    var maxSize="";
    var size = new Array(Math.abs(day),sizeSize,countrySize);
    for (var i = 0; i < size.length; i++) {
        // 如果i+1等于选项长度则取值后添加空字符串，否则为逗号
        maxSize = (maxSize + size[i]) + (((i + 1)== size.length) ? '':',');
    }
    var oData ={
        subjectId: subjectId,
        beforeDay: day,
        maxSize: maxSize
    };
    $p(url,'json',oData,true,TIMEOUT,function ok(msg){
        var aggregations = msg.data.es.aggregations;
        var qxtdata = aggregations.updatetime_d.buckets;
        var zztdata = aggregations.site.buckets;
        var btdata = aggregations.country.buckets;

        // 显示 日期、站点、国家 表格 start
        setTemplate("subjectStatisticsDiv1", "subjectStatisticsTemp1", aggregations);
        setTemplate("subjectStatisticsDiv2", "subjectStatisticsTemp2", aggregations);
        setTemplate("subjectStatisticsDiv3", "subjectStatisticsTemp3", aggregations);
        // 显示 日期、站点、国家 表格 end

        var returnData = function (qq) {
            var res = [];
            for (var i = 0; i < qq.length; i++) {
                res.push(
                    qq [i].doc_count
                );
            }
            return res;
        };
        var returnday = function (qq) {
            var res = [];
            for (var i = 0; i < qq.length; i++) {
                res.push(
                    qq [i].key
                );
            }
            return res;
        };
        var returnkey = function (qq) {
            var res = [];
            for (var i = 0; i < qq.length; i++) {
                res.push(
                    qq [i].key
                );
            }
            return res;
        };
        var returnbt = function (qq) {
            var res = [];
            for (var i = 0; i < qq.length; i++) {
                res.push({
                    name: qq [i].key,
                    value: qq [i].doc_count
                });
            }
            return res;
        };
        $("#main").empty();
        var myChart = echarts.init(document.getElementById('main'));
        option = {
            title: {
                text: '1.按日期统计，曲线图'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },

            color: ['#4169E1'],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: returnday(qxtdata)
            },
            yAxis: {
                nameLocation: 'and',
                type: 'value'
            },
            series: [
                {
                    name: '数量',
                    type: 'line',
                    stack: '总量',
                    data: returnData(qxtdata),
                }
            ]
        };
        myChart.setOption(option);
        $("#main2").empty();
        var myChart2 = echarts.init(document.getElementById('main2'));
        var option2 = {
            color: ['#4169E1'],
            title: {
                text: '2.按来源网站统计，柱状图'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['2011年', '2012年']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'value',
                    data : returnkey(zztdata),
                    boundaryGap: [0, 0.01],
                    inverse:false
                }

            ],
            yAxis: [
                {
                    type: 'category',
                    data : returnkey(zztdata)
                }
            ],
            series: [
                {
                    name: '数据',
                    type: 'bar',

                    data: returnData(zztdata),
                }

            ]
        };
        myChart2.setOption(option2);
        $("#main3").empty();
        var myChart3 = echarts.init(document.getElementById('main3'));
        var option3 = {
            title: {
                text: '3.按来源国家统计，饼图'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: returnbt(btdata),
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart3.setOption(option3);
    });
}


