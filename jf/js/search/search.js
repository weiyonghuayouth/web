/**
 * Created by Administrator on 2016/4/26.
 */


function search_init(){
    //加载头部
    ajaxHtml($("#jf-top"));

    //加载导航栏
    ajaxHtml($("#jf-menu"));

    //快速搜索与准确搜索
    $("#search-tabs").slide({
        titCell:".search-nav li", //鼠标触发对象
        targetCell:".search-sub li", //titCell里面包含的要显示/消失的对象
        trigger:"click",
        delayTime:300 , //效果时间
        triggerTime:0, //鼠标延迟触发时间（默认150）
        returnDefault:false //鼠标移走后返回默认状态，例如默认频道是“预告片”，鼠标移走后会返回“预告片”（默认false）
    });

    $( ".mazy-search-menu" ).selectmenu();
    //回车事件
    $("#simpleSearchText").keyup(function (e) {
        if (e.keyCode == 13) {
            if (!isNullStr($("#simpleSearchText").val())){
                simpleSearch(1, 20, true, -1)
            }

        }
    });
    //首页专题树获取
    //   var oUrl = URL + 'zh/subject/0/gettree.do?token=gettree';
    //
    //$p(oUrl,'json','',true,TIMEOUT,function ok(msg){
    //    var msgcon = msg.data[0];
    //    var upmsg = template("test", msgcon);
    //    $("#special-con").html(upmsg);
    //});
}

//首页专题跳转
function treeClick(i) {
    var id = $(i).attr("idname");
    window.location.href = SEMINAR_INDEX + '?type=subject&id=' + id;
}

//拼装图柱状图
function piefn(idname,odata){
    var myChart = echarts.init(document.getElementById(idname));
    myChart.setOption({
        tooltip : {
            show:true,
            showContent:true,
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series : [
            {
                name: '数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:odata,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    })

}
//统计采集总数
$p(URL+"zh/es/gettotal/ver.do?token=1",'json',"",true,TIMEOUT,function ok(msg){
    var num = msg.data.es.count;
    var StrNum = ""+num;
    var parentdiv='';
    for (var i =0; i < StrNum.length; i++) {
        parentdiv +='<i class="numStyle">'+StrNum.substr(i,1)+'</i>'
    }
    $(".p-title").append($(parentdiv));
});


//统计图 请求函数
$p(URL+"zh/es/statistics/ver.do?token=1",'json',{maxSize:'10,10,10',esfields:'language,site,country'},true,TIMEOUT,function ok(msg){
    //当天返回值
    var day = msg.data.day;
    var btdata =day.language.buckets;
    var site =day.site.buckets;
    var country =day.country.buckets;
    //全部返回值
    var total = msg.data.total;
    var alllanguage= total.language.buckets;
    var allcountry =total.country.buckets;
    var allsite = total.site.buckets;
    var returnbt = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            res.push({
                name: data [i].key,
                value: data [i].doc_count
            });
        }
        return res;
    };

    var language= returnbt(btdata);
    var Sites= returnbt(site);
    var Country= returnbt(country);
    var ALLlan=returnbt(alllanguage);
    var ALLsites=returnbt(allsite);
    var ALLcountrys=returnbt(allcountry);

    piefn("pie-1",language);
    piefn("pie-2", Country);
    piefn("pie-3",ALLlan);
    piefn("pie-4", ALLcountrys);
});

/**
 * 快速搜索
 * 
 * @author <a href="mailto:wentian.he@qq.com">hewentian</a>
 * @date 2016年5月18日 下午3:15:26
 * 
 * @param pageIndex 当前页码
 * @param pageSize 每页显示多少个记录
 * @param addCookie 是否加到cookie中, true/false, 分页的时候，是不需要放到cookie中的
 * @param contentFromCookie 条件是否从cookie中取出来，1.是;－1.否
 */
function simpleSearch(pageIndex, pageSize, addCookie, contentFromCookie) {
	var simpleSearchText = "";
	if (contentFromCookie == -1) {
		simpleSearchText =($("#simpleSearchText").val());
	} else {
		simpleSearchText = getXCookie2(SIMPLE_SEARCH_TEXT);
	}
	
	simpleSearchText = $.trim(simpleSearchText);
	if ("" == simpleSearchText) {
		alert("请输入要查询的内容");
		return;
	}

    var param = {
        token:"1",
        "condition1Value":simpleSearchText,
//          "condition1Field":"",
        "currentIndex":pageIndex,
        "showRow": pageSize,
        "type":"ss",
        "name":simpleSearchText
    };
    var p = encodeURI(JSON.stringify(param));
    window.location.href =  Search_History +'?type=history&data='+encodeURI(JSON.stringify(param));
}

/**
 * 高级搜索
 * 
 * @author <a href="mailto:wentian.he@qq.com">hewentian</a>
 * @date 2016年5月19日 上午11:15:26
 * 
 * @param pageIndex 当前页码
 * @param pageSize 每页显示多少个记录
 * @param addCookie 是否加到cookie中, true/false, 分页的时候，是不需要放到cookie中的
 * @param contentFromCookie 条件是否从cookie中取出来，1.是;－1.否
 */
function advancedSearch(pageIndex, pageSize, addCookie, contentFromCookie) {
	var containsAllKeywords = "";
	var containsAnyKeywords = "";
	var notContainsKeywords = "";
	var searchTimeRange = "";
    var site = "";
    var name = "";
    var latelyDay= 0;

    containsAllKeywords = $("#containsAllKeywords").val();
    containsAnyKeywords = $("#containsAnyKeywords").val();
    notContainsKeywords = $("#notContainsKeywords").val();
    site = $("#siteKeywords").val();
    searchTimeRange = $("#searchTimeRange").val();

    if(!isNullStr(containsAllKeywords)){
        name += containsAllKeywords;
    }
    if(!isNullStr(containsAnyKeywords)){
        name += "+"+containsAnyKeywords;
    }
    if(!isNullStr(notContainsKeywords)){
        name += "-"+notContainsKeywords;
    }
    if(!isNullStr(site)){
        name += "-"+site;
    }

    if(searchTimeRange==1){
        name += "[当天]";
    }
    if(searchTimeRange==2){
        name += "[3天]";
    }
    if(searchTimeRange==3){
        name += "[本周]";
    }
    if(searchTimeRange==4){
        name += "[本月]";
    }
    if(searchTimeRange==5){
        name += "[本年]";
    }
    name = name.substring(0, 20);

	// 下面设置开始时间
	if (searchTimeRange == 0) { // 全部时间，默认为从2014年1月1日开始
        latelyDay = 0;
	} else if (searchTimeRange == 1) { // 最近一天
        latelyDay = -1;
	} else if (searchTimeRange == 2) { // 最近三天
        latelyDay = -3;
	} else if (searchTimeRange == 3) { // 最近一周
        latelyDay = -7;
	} else if (searchTimeRange == 4) { // 最近一月
        latelyDay = -30;
	} else if (searchTimeRange == 5) { // 最近一年
        latelyDay = -365;
	}

    var oUrl = URL+'zh/es/highsearch/1.do';
    var param = {
        token:"1",
        "containsAllKeywords":containsAllKeywords,
        "containsAnyKeywords":containsAnyKeywords,
        "notContainsKeywords": notContainsKeywords,
        "site":site,
        "latelyDay":latelyDay,
//        "queryTimeField": queryTimeField,
//        "siteType": siteType, // 服务器端暂未提供
//        "languageType": languageType, // 服务器端暂未提供
        "currentIndex": pageIndex,
        "showRow": pageSize,
        "type":"as",
        "name":name
    };
    var p =encodeURI(JSON.stringify(param)) ;
    window.location.href = Search_History +'?type=history&data='+p;


}