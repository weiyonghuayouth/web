
/**
 * 用来记录当前的翻页框具体是那个的,有专题,简报,检索,期刊等
 * @type {null}
 */
var localData = null;
/**
 * 默认的一页条数
 * @type {number}
 */
var def_row_size = 20;

/*begin 专题---------------------------------------------------*/
/**
 * 页面初始化
 */

function subject_init() {
    //准备好框架以免下面调用没有东西
    //加载头部
    ajaxHtml($("#jf-top"));
    //加载导航栏
    ajaxHtml($("#jf-menu"));

    //step 5 点击树显示隐藏功能
    treeLeft();
    //添加按钮
    $("#tree-tools").find(".tools-add").click(function () {
        if($('#group').hasClass("dl_on")){
            $.ajax({
                type: "get",
                url: 'addTopic_dialog.html',
                cache: false,
                dataType: "html",
                beforeSend:function(){
                    LOADING();
                },
                success: function (msg) {
                    layer.closeAll();
                    var oContent = msg;
                    //自定页
                    layer.open({
                        title: '添加专题',
                        type: 1,
                        skin: 'jf-dialog', //样式类名
                        shift: 2,
                        area: ["800px", "500px"],
                        shadeClose: true, //开启遮罩关闭
                        content: oContent
                    });
                }

            })
        }
        else if($('#journaldefine').hasClass("dl_on")){
            layer.open({
                title: '添加简报',
                type: 1,
                skin: 'jf-dialog', //样式类名
                shift: 2,
                area: ["500px", "250px"],
                shadeClose: true, //开启遮罩关闭
                content: $('#journaldefineAdd'),
                btn: ['确定', '取消'],
                yes: function(){
                    journaldefineAdd();
                }
            });
        }
        else {
            Msg("此栏目不允许添加")
        }

    });
    //修改按钮
    $("#tree-tools").find(".tools-edit").click(function () {
        if($('#group').hasClass("dl_on") && $('#group dd a').hasClass("a_on")){
            $.ajax({
                type: "get",
                url: 'editTopic_dialog.html',
                cache: false,
                dataType: "html",
                beforeSend:function(){
                    LOADING();
                },
                success: function (msg) {
                    layer.closeAll();
                    var oContent = msg;
                    //自定页
                    layer.open({
                        title: '修改专题',
                        type: 1,
                        skin: 'jf-dialog', //样式类名
                        shift: 2,
                        area: ["800px", "500px"],
                        shadeClose: true, //开启遮罩关闭
                        content: oContent
                    });
                }

            })
        }else if($('#journaldefine').hasClass("dl_on") && $('#journaldefine dd a').hasClass("a_on")){
            layer.open({
                title: '修改简报',
                type: 1,
                skin: 'jf-dialog', //样式类名
                shift: 2,
                area: ["500px", "250px"],
                shadeClose: true, //开启遮罩关闭
                content: $('#journaldefineAdd'),
                btn: ['确定', '取消'],
                yes: function(){
                    journaldefineUpdate();
                }
            });
        }
        else {
            Msg("你未选择，或操作有误（只限修改专题或简报！）")
        }
    });
    //删除按钮
    $("#tree-tools").find(".tools-delete").click(function () {
        if($('#group').hasClass("dl_on") && $('#group dd a').hasClass("a_on")){
            var oval = $("#group").find(".a_on span").html();
            var oData = {
                "token": "1",
                "id": $("#group").find(".a_on").attr("idname")
            };
            layer.alert("是否要删除"+oval+"专题？", {
                skin: "jf-dialog",
                closeBtn:1
            }, function () {
                $p(URL + 'zh/subject/0/del.do','json',oData,true,TIMEOUT,function ok(msg){
                    Popup("删除成功，将自动刷新");
                    setTimeout("window.location.href = SEMINAR_INDEX",1000);
                });
            });
        }else if($('#journaldefine').hasClass("dl_on") && $('#journaldefine dd a').hasClass("a_on")){
            var oval = $("#journaldefine").find(".a_on span").html();
            var id = $("#journaldefine").find(".a_on").attr("idname");
            var oData = {
                "token": "1",
                "id": id
            };
            layer.alert("是否要删除"+oval+"简报？", {
                skin: "jf-dialog",
                closeBtn:1
            }, function () {
                $p(URL + 'zh/journaldefine/' + id + '/del.do?token=1','json',oData,true,TIMEOUT,function ok(msg){
                    Popup("删除成功，将自动刷新");
                    setTimeout("window.location.href = 'journal.html'",1000);
                });
            });
        }else {
            Msg("你未选择，或操作有误（只限删除专题或简报！）")
        }


    });

    //ok
}

function subject_menu_get() {
    $p(URL + 'zh/subjectgroup/0/get.do','json',{"token": "subject_group"},true,TIMEOUT,function ok(msg){
        setXCookie2( "USER_GROUP_LIST",  JSON.stringify(msg.data))
    });
}
/**
 * 获取专题列表
 */
function zhuanti_menu_Ajax() {
    $p(URL + 'zh/subject/0/gettree.do','json',{"token": "gettree"},true,TIMEOUT,function ok (msg){
        var oData = msg.data[0];
        $("#group").attr("idname", oData.groupId);
        var oHtml = template("group-tpl", oData);
        $("#group").find("dd").html(oHtml);
        $("#group").attr("mount", true);

        if (url_param.get("type") == "subject" || url_param.get("type") == null) {

            //showdata
            $("#group").addClass("dl_on");
            var id = url_param.get("id");
            if (id == null || id == "") {
                if (oData.treeList.length > 0) {
                    id = oData.treeList[0].id;
                }

            }
            for (var i = 0; i < oData.treeList.length; i++) {
                if (id == oData.treeList[i].id) {
                    oData.treeList[i].select = true;
                    $("#group a").eq(i).addClass("a_on");
                    $("#group a").eq(i).click();
                } else {
                    oData.treeList[i].select = false;
                }
            }
        }
    });
}

/**
 * 自动打开收藏夹
 */
function openFavorites (){
    $("#collect").addClass("dl_on");
    $("#collect a").eq(0).addClass("a_on");
    $("#collect a").eq(0).click();
}

/**
 * 简报添加列表树建立
 */
function jianbao_menu_MoveList() {
    $p(URL + 'zh/journaldefine/gettree.do','json',{"token": "1"},true,TIMEOUT,function ok(msg){
        var aHtml = template("infoMoveList-tpl", msg);
        $("#infoMoveList ul").html(aHtml);
        if(msg.data == null || msg.data == ""){
            $('.none_msg').show();
        }else {
            $('.none_msg').hide();
        }
    });
}
/**
 * 获取简报列表
 */
function jianbao_menu_Ajax() {
    $p(URL + 'zh/journaldefine/gettree.do','json',{"token": "1"},true,TIMEOUT,function ok(msg){

        var oHtml = template("journaldefine-tpl", msg);
        $("#journaldefine").find("dd").html(oHtml);

        var aHtml = template("infoMoveList-tpl", msg);
        $("#infoMoveList ul").html(aHtml);
        $("#journaldefine").attr("mount", true);
        if(msg.data == null || msg.data == ""){
            $('.none_msg').show();
        }else {
            $('.none_msg').hide();
        }
        $("#journaldefine").addClass("dl_on");
        $("#journaldefine a").eq(0).addClass("a_on");
        $("#journaldefine a").eq(0).click();
        if (url_param.get("type") == "journaldefine") {
            //showdata
            $("#journaldefine").addClass("dl_on");
            $("#journaldefine a").eq(0).addClass("a_on");
            $("#journaldefine a").eq(0).click();
            var id = url_param.get("id");
            if (id == null || id == "") {

            }

        }
    });
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
        setXCookie(getXCookie2('USER_ID'), SEARCH_HISTORY, key, param, null, 9);
        historyytree(key,true);
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

    if (url_param.get("type") == "history") {
        $("#searchHistory").addClass("dl_on");
        $("#group-history a").eq(0).addClass("a_on");
    }
    if (url_param.get("type") == null) {
        $("#searchHistory").addClass("dl_on");
        $("#group-history a").eq(0).addClass("a_on");
        $("#group-history a").eq(0).click();
    }
}

function treeChlidClick(obj, catalog) {
    treeChlidClickKey(obj, catalog, "");
}
/**
 * 鼠标点击左侧树事件
 */

function treeChlidClickKey(obj, catalog, key) {

    var oThis = $(obj);
    $("#tree-menu").find('.tree-a').removeClass("a_on");
    oThis.addClass("a_on");
    if (catalog == 1) {
        CATALOG_IF = 1;
        $("#seminar-contlist1").attr("idname", oThis.attr("idname"));
        $("#seminar-contlist1").css("display", "block").siblings().css("display", "none");
        searchBytree(true);
    }
    if (catalog == 2) {
        CATALOG_IF = 2;
        $("#seminar-contlist2").css("display", "block").siblings().css("display", "none");
        collecBytree(true,false);
    }
    if (catalog == 3) {
        CATALOG_IF = 3;
        $("#seminar-contlist3").attr("idname", oThis.attr("idname"));
        $("#seminar-contlist3").css("display", "block").siblings().css("display", "none");
        journaldefineBytree(true);
    }
    if (catalog == 4) {
        CATALOG_IF = 4;
        $("#seminar-contlist4").css("display", "block").siblings().css("display", "none");
        historyytree(key,true);
    }
}

/**
 * 显示专题内容
 */
//专题组内容显示
function searchBytree(type) {
    var Index = '';
    if(type){
        Index = 1
    }else{
        Index = PAGE_INDEX
    }
    var inData = {
        'token': '1',
        'subjectId': $("#seminar-contlist1").attr("idname"),
        'currentIndex': Index,
        'showRow': def_row_size
    };
    localData = inData;
    $p(URL + 'zh/es/subject/firstsearch/ver.do','json',localData,true,TIMEOUT,subjectCon);
    function subjectCon(msg){
        var oTotal = msg.data.es.hits.total;   //总条数
        var oHtml = template("seminar-contlist-tpl1", msg);
        $("#seminar-contlist1").html(oHtml);
        $("#seminar-content ul .checkList input").checked = false;
        if (oTotal==0) {
            $(".nullContList1").show();
        }
        if (oTotal !== 0) {
            $("#jf-pagination").show();
            $("#jf-pagination").find(".total").html("共计" + oTotal + "条");
            $("#jf-pagination").find(".page-list").jqPaginator({
                totalCounts: oTotal, //设置分页的总条目数
                pageSize: def_row_size,     //设置每一页的条目数
                visiblePages: 6,   //设置最多显示的页码数
                currentPage: Index,   //当前页码
                first: '<li class="first"><a href="javascript:void(0);">首页<\/a><\/li>',
                prev: '<li class="prev"><a href="javascript:void(0);">上一页<\/a><\/li>',
                next: '<li class="next"><a href="javascript:void(0);">下一页<\/a><\/li>',
                last: '<li class="last"><a href="javascript:void(0);">末页<\/a><\/li>',
                page: '<li class="page"><a href="javascript:void(0);">{{page}}<\/a><\/li>',
                onPageChange: function (n) {
                    if (localData.currentIndex != n) {
                        localData.currentIndex = n;
                        PAGE_INDEX = n;
                        $p(URL + 'zh/es/subject/firstsearch/ver.do','json',localData,true,TIMEOUT,function ok(msg){
                            var oTotal = msg.data.es.hits.total;   //总条数
                            var oHtml = template("seminar-contlist-tpl1", msg);
                            $("#seminar-contlist1").html(oHtml);
                        });
                    }
                }
            });

        } else {
            $("#jf-pagination").hide();
        }
    }
}

//
function searchDefaultDate(){
    var myDate=new Date();
    myDate.setMonth(myDate.getMonth()-6);
    var dateVal = myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
    $("#seminar-contlist2 .filter-startDate").val(dateVal);
}

/**
 * 展示收藏夹
 * @param type    true是专题点击  false 是右边刷新点击
 * @param filter   true是过滤按钮    false 是普通获取或者刷新按钮
 * @param obj      过滤获取当前的值
 */
var StCache = "";
var AnCache = "";
var TitleCache = "";
function collecBytree(type,filter,obj) {
    var Index = '';

    var myDate=new Date();
    //今天
    var dateValAn = myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
    myDate.setMonth(myDate.getMonth()-6);
    //半年
    var dateValSt= myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();

    if(type){
        Index = 1
    }else{
        Index = PAGE_INDEX
    }
    if(filter){
        var StatDate = $(obj).siblings('.filter-startDate').val();
        var EndDate = $(obj).siblings('.filter-endDate').val();
        if(isNullStr($.trim(StatDate)) || isNullStr($.trim(EndDate))){
            Msg("请填写日期！");
            return false;
        }
            var inData = {
                token: "1",
                state: "1",
                currentIndex: Index,
                showRow: def_row_size,
                startDate: $(obj).siblings('.filter-startDate').val(),
                endDate: $(obj).siblings('.filter-endDate').val(),
                infoTitle:$(obj).siblings('.filter-infoTitle').val()
            };
    }else {
        if(type){
            var inData = {
                token: "1",
                state: "1",
                currentIndex: Index,
                showRow: def_row_size,
                startDate:dateValSt,
                endDate:dateValAn
            };
        }else {
            var inData = {
                token: "1",
                state: "1",
                currentIndex: Index,
                showRow: def_row_size,
                startDate: $("#seminar-contlist2 .seminar-tools .filter-startDate").val(),
                endDate: $("#seminar-contlist2 .seminar-tools .filter-endDate").val(),
                infoTitle:$("#seminar-contlist2 .seminar-tools .filter-infoTitle").val()
            };
        }
    }
    localData = inData;
    var inUrl = URL + 'zh/collect/0/get.do';
    $p(inUrl,"json",localData,true,TIMEOUT,collectCon);
    function collectCon(msg){
        var oData = msg.data;
        if(filter){
            StCache = oData.dateValSt1 = $(obj).siblings('.filter-startDate').val();
            AnCache = oData.dateValAn1 =$(obj).siblings('.filter-endDate').val();
            TitleCache = oData.dateInfoTitle=$(obj).siblings('.filter-infoTitle').val();
        }else{
            if(type){
                StCache = msg.data.dateValSt1 = dateValSt;
                AnCache = msg.data.dateValAn1 =dateValAn;
                TitleCache ="";
            }else{
                msg.data.dateValSt1 =StCache;
                msg.data.dateValAn1 =AnCache;
                msg.data.dateInfoTitle=TitleCache;
            }
        }
        var oTotal = oData.count;   //总条数
        var oHtml = template("seminar-contlist-tpl2", oData);
        $("#seminar-contlist2").html(oHtml);
        $("#seminar-content ul .checkList input").checked = false;
        if (oTotal==0) {
            $(".nullContList2").show();
        }
        if (oTotal !== 0) {
            $("#jf-pagination").show();
            $("#jf-pagination").find(".total").html("共计" + oTotal + "条");

            $("#jf-pagination").find(".page-list").jqPaginator({
                totalCounts: oTotal,
                pageSize: def_row_size,
                visiblePages: 6,
                currentPage: Index,
                first: '<li class="first"><a href="javascript:void(0);">首页<\/a><\/li>',
                prev: '<li class="prev"><a href="javascript:void(0);">上一页<\/a><\/li>',
                next: '<li class="next"><a href="javascript:void(0);">下一页<\/a><\/li>',
                last: '<li class="last"><a href="javascript:void(0);">末页<\/a><\/li>',
                page: '<li class="page"><a href="javascript:void(0);">{{page}}<\/a><\/li>',
                onPageChange: function (n) {
                    if (localData.currentIndex != n) {
                        localData.currentIndex = n;
                        PAGE_INDEX = n;
                        var inUrl = URL + 'zh/collect/0/get.do';
                        $p(inUrl,"json",localData,true,TIMEOUT,function ok(msg){
                            var oData = msg.data;
                            if(filter){
                                StCache = oData.dateValSt1 = $(obj).siblings('.filter-startDate').val();
                                AnCache = oData.dateValAn1 =$(obj).siblings('.filter-endDate').val();
                                TitleCache = oData.dateInfoTitle=$(obj).siblings('.filter-infoTitle').val();
                            }else{
                                if(type){
                                    StCache = msg.data.dateValSt1 = dateValSt;
                                    AnCache = msg.data.dateValAn1 =dateValAn;
                                    TitleCache ="";
                                }else{
                                    msg.data.dateValSt1 =StCache;
                                    msg.data.dateValAn1 =AnCache;
                                    msg.data.dateInfoTitle=TitleCache;
                                }
                            }
                            var oTotal = oData.count;   //总条数
                            var oHtml = template("seminar-contlist-tpl2", oData);
                            $("#seminar-contlist2").html(oHtml);
                        });
                    }
                }
            });
        } else {
            $("#jf-pagination").hide();
        }
    }
}

/**
 *展示简报
 */
function journaldefineBytree(type) {
    var Index = '';
    if(type){
        Index = 1
    }else{
        Index = PAGE_INDEX
    }
    var inData = {
        state:1,
        token: "1",
        journalDefineId : $("#seminar-contlist3").attr("idname"),
        currentIndex: Index,
        showRow: def_row_size
    };
    localData = inData;
    var inUrl = URL + 'zh/journal/0/getcollectinfo.do';

    $j(inUrl,'json', localData,false,true, true, 30000,journaldefineCon);
     function journaldefineCon(msg){
         var oData = msg.data;
         var oTotal = oData.count;   //总条数
         var oHtml = template("seminar-contlist-tpl3", oData);
         $("#seminar-contlist3").html(oHtml);
         $("#seminar-content ul .checkList input").checked = false;
         $("#seminar-contlist3 #ThisPeriod").remove();
         if (oTotal==0) {
             $(".nullContList3").show();
         }
         if (oTotal !== 0) {
             $("#jf-pagination").show();
             $("#jf-pagination").find(".total").html("共计" + oTotal + "条");

             $("#jf-pagination").find(".page-list").jqPaginator({
                 totalCounts: oTotal,
                 pageSize: def_row_size,
                 visiblePages: 6,
                 currentPage: Index,
                 first: '<li class="first"><a href="javascript:void(0);">首页<\/a><\/li>',
                 prev: '<li class="prev"><a href="javascript:void(0);">上一页<\/a><\/li>',
                 next: '<li class="next"><a href="javascript:void(0);">下一页<\/a><\/li>',
                 last: '<li class="last"><a href="javascript:void(0);">末页<\/a><\/li>',
                 page: '<li class="page"><a href="javascript:void(0);">{{page}}<\/a><\/li>',
                 onPageChange: function (n) {
                     if (localData.currentIndex != n) {
                         localData.currentIndex = n;
                         PAGE_INDEX = n;
                         var inUrl = URL + 'zh/journal/0/getcollectinfo.do';
                         $p(inUrl,'json', localData, true, TIMEOUT,function ok(msg){
                             var oData = msg.data;
                             var oTotal = oData.count;   //总条数
                             var oHtml = template("seminar-contlist-tpl3", oData);
                             $("#seminar-contlist3").html(oHtml);
                         });
                         //获取期刊列表
                         getCollectInfoBox();
                     }
                 }
             });
         } else {
             $("#jf-pagination").hide();
         }
     }
    getCollectInfoBox();
}

/**
 *展示检索历史
 */
function historyytree(key,type) {
    var Index = '';
    if(type){
        Index = 1
    }else{
        Index = PAGE_INDEX
    }
    if(key == 'idname'){
        key=$('#group-history .a_on').attr('idname');
    }
    var data = getXCookieByKey(getXCookie2('USER_ID'), SEARCH_HISTORY, key);

    if (isNullStr(data)) {
        return;
    }
    var oUrl = "";
    localData = JSON.parse(data);
    localData.currentIndex = Index;
    if (localData.type == "ss") {
        oUrl = URL + 'zh/es/fastsearch/1.do';
    }
    else {
        oUrl = URL + 'zh/es/highsearch/1.do';
    }

    $p(oUrl,'json', localData, true, TIMEOUT, historyCon);
    function historyCon(msg){
        var oTotal = msg.data.es.hits.total;   //总条数
        msg.data.es.hits.catal = CATALOG_IF;
        var oHtml = template("seminar-contlist-tpl4", msg);
        $("#seminar-contlist4").html(oHtml);
        $("#seminar-content ul .checkList input").checked = false;
        if (oTotal==0) {
            $(".nullContList4").show();
        }
        if (oTotal !== 0) {
            $("#jf-pagination").show();
            $("#jf-pagination").find(".total").html("共计" + oTotal + "条");

            $("#jf-pagination").find(".page-list").jqPaginator({
                totalCounts: oTotal,
                pageSize: def_row_size,
                visiblePages: 6,
                currentPage: Index,
                first: '<li class="first"><a href="javascript:void(0);">首页<\/a><\/li>',
                prev: '<li class="prev"><a href="javascript:void(0);">上一页<\/a><\/li>',
                next: '<li class="next"><a href="javascript:void(0);">下一页<\/a><\/li>',
                last: '<li class="last"><a href="javascript:void(0);">末页<\/a><\/li>',
                page: '<li class="page"><a href="javascript:void(0);">{{page}}<\/a><\/li>',
                onPageChange: function (n) {
                    if (localData.currentIndex != n) {
                        var oUrl = URL + 'zh/es/fastsearch/1.do';
                        if (localData.type == "ss") {
                            oUrl = URL + 'zh/es/fastsearch/1.do';
                        }
                        else {
                            oUrl = URL + 'zh/es/highsearch/1.do';
                        }
                        localData.currentIndex = n;
                        PAGE_INDEX = n;
                        $p(oUrl,'json', localData, true, TIMEOUT, function ok(msg){
                            msg.data.es.hits.catal = CATALOG_IF;
                            var oTotal = msg.data.es.hits.total;   //总条数
                            var oHtml = template("seminar-contlist-tpl4", msg);
                            $("#seminar-contlist4").html(oHtml);
                        });

                    }
                }
            });

        } else {
            $("#jf-pagination").hide();
        }
    }
}

//获取期刊列表
function getCollectInfoBox(){
    var CoUrl = URL + 'zh/journal/0/get.do?token=1';
    var CoData ={
        state: 2,
        journalDefineId:$("#journaldefine").find(".a_on").attr("idname"),
        currentIndex: 1,
        showRow: 10000,
        reverse: true
    };
    $j(CoUrl,'json', CoData,false,true, true, 30000,function ok(msg){
        var oTotal = msg.data.count;   //总条数
        var oHtml = template("getCollectInfoBox-tpl", msg);
        $("#getCollectInfoBox").html(oHtml);
        var cloneDiv =$("#getCollectInfoBox .getCollectInfoCopy").clone(true);   //复制出需要的简报列表 供以下调用
        $("#getCollectInfoPasted").empty();
        $("#getCollectInfoPasted").append(cloneDiv);

    });
}


//单选 多选图标
function checkSelect(id,Cla) {
    var oFa = $(id+Cla).find(".fa");
    if (oFa.hasClass("fa-square-o")) {
        oFa.removeClass("fa-square-o");
        oFa.addClass("fa-check-square-o");
    } else if (oFa.hasClass("fa-check-square-o")) {
        oFa.removeClass("fa-check-square-o");
        oFa.addClass("fa-square-o");
    }

}
//全选
function checkAll(addId,addCla) {
    checkSelect(addId,addCla);
    if ($(addId+addCla).find(".fa").hasClass("fa-check-square-o")) {
       $(addId+" .checkList input").each(function () {
            this.checked = true;
        })
    } else {
        $(addId+" .checkList input").each(function () {
            this.checked = false;
        })
    }
}
//反选
function Reversecheck(addId,addCla) {
    checkSelect(addId,addCla);
    $(addId+" .checkList input").each(function () {
        this.checked = !this.checked;
    });
}



/**
 * 专题搜索
 *
 * @param category   true 为 快速  false 为高级
 */
function subjectSearch(category){
    var title =category? "快速搜索":"高级搜索";
    var box = category?'#fastSearchBox':'#highSearchBox';
    var Area = category?["500px", "250px"]:["600px", "350px"];
    layer.open({
        title: title,
        type: 1,
        skin: 'jf-dialog', //样式类名
        shift: 2,
        area: Area,
        shadeClose: true, //开启遮罩关闭
        content: $(box),
        btn: ['搜索', '取消'],
        yes: function(){
            if(category){
                var conValue =$.trim($('#fastSearchBox .conValue input').val());
                if(isNull(conValue)){
                    $('#fastSearchBox .conValueTips').html('内容不能为空');
                    return
                }else{$('#fastSearchBox .conValueTips').html('');}
                var oData = {
                    subjectId :$('#group dd .a_on').attr('idname'),
                    condition1Value :conValue,
                    currentIndex :1,
                    showRow:20
                };
                var oUrl = URL + 'zh/subject/fastSearch/ver.do?token=1';
            }else {
                var containsAllKeywords = $('#highSearchBox .containsAllKeywords input').val();
                var notContainsKeywords = $('#highSearchBox .notContainsKeywords input').val();
                var site = $('#highSearchBox .siteKeywords input').val();
                var latelyDay = $('#highSearchBox .searchTimeRange select').val();

                var oData = {
                    subjectId :$('#group dd .a_on').attr('idname'),
                    "containsAllKeywords":containsAllKeywords,
                    "notContainsKeywords": notContainsKeywords,
                    "site":site,
                    "latelyDay":latelyDay,
                    currentIndex :1,
                    showRow:20
                };
                var oUrl = URL + 'zh/subject/highSearch/ver.do?token=1';
            }

            $p(oUrl,'json',oData,true,TIMEOUT,function ok(msg){
                    var oTotal = msg.data.es.hits.total;   //总条数
                    var oHtml = template("seminar-contlist-tpl1", msg);
                    $("#seminar-contlist1").html(oHtml);
                    $("#seminar-content ul .checkList input").checked = false;
                    if (oTotal==0) {
                        $(".nullContList1").show();
                    }
                    if (oTotal !== 0) {
                        $("#jf-pagination").show();
                        $("#jf-pagination").find(".total").html("共计" + oTotal + "条");
                        $("#jf-pagination").find(".page-list").jqPaginator({
                            totalCounts: oTotal, //设置分页的总条目数
                            pageSize: def_row_size,     //设置每一页的条目数
                            visiblePages: 6,   //设置最多显示的页码数
                            currentPage: 1,   //当前页码
                            first: '<li class="first"><a href="javascript:void(0);">首页<\/a><\/li>',
                            prev: '<li class="prev"><a href="javascript:void(0);">上一页<\/a><\/li>',
                            next: '<li class="next"><a href="javascript:void(0);">下一页<\/a><\/li>',
                            last: '<li class="last"><a href="javascript:void(0);">末页<\/a><\/li>',
                            page: '<li class="page"><a href="javascript:void(0);">{{page}}<\/a><\/li>',
                            onPageChange: function (n) {
                                if (oData.currentIndex != n) {
                                    oData.currentIndex = n;
                                    $p(oUrl,'json',oData,true,TIMEOUT,function ok(msg){
                                        var oTotal = msg.data.es.hits.total;   //总条数
                                        var oHtml = template("seminar-contlist-tpl1", msg);
                                        $("#seminar-contlist1").html(oHtml);
                                    });
                                }
                            }
                        });

                    } else {
                        $("#jf-pagination").hide();
                    }
            })
        }
    });

}

/****
 * 设置已读 或者 垃圾
 *
 * @param Type  标记类型（如：read已读，rubbish垃圾）
 * @param is_Mark  是否标记true or false （必须）
 * @param menu_id    左边专题的 对应id
 * @param list_id    右边的列表 id
 * @param is_rk     是否点击单个 ，不是批量操作
 * @param obj     当前的 this
 * @constructor
 */

function ReadUnread(Type,is_Mark,menu_id,list_id,is_rk,obj){
    if(is_rk){
        if(Type == 'read'){
            var esIndex = $(obj).siblings("input").attr("infoEsIndex");
            var esIds = $(obj).siblings("input").attr("collectInfoIds");
        }else {
            var esIndex = $(obj).parents(".checkList").find("input").attr("infoEsIndex");
            var esIds = $(obj).parents(".checkList").find("input").attr("collectInfoIds");
        }

    }else {
        var checkBoxs = $(list_id+" .checkAll input[type='checkbox']:checked");
        var esIndex = '';
        var esIds = '';
        if (checkBoxs.length == 0) {
            layer.alert("至少选中一项进行操作", {
                skin: "jf-dialog",
                closeBtn: 0
            });
            return false;
        }
        for (var i = 0; i < checkBoxs.length; i++) {
            var o = $(checkBoxs[i]);
            esIndex += o.attr("infoEsIndex") + ",";
            esIds += o.attr("collectInfoIds") + ",";
        }
    }
    var rubhtml = $(obj).find(".my-rubbish").html();
    var autoMark = '';
    if(rubhtml == ' 垃圾'){
        autoMark = 'true'
    }else{
        autoMark = 'false'
    }
    if(Type == 'read'){
        var markId = 'read';
        var mark = is_Mark;
    }else {
        var markId = $(menu_id+" dd .a_on").attr("idname");
        var mark = autoMark;
    }
    var oData = {
        esIndex: esIndex,
        esIds:esIds,
        type:Type,
        markId:markId,
        isMark:mark
    };
    var oUrl = URL + 'zh/es/mark/ver.do?token=1';
    $p(oUrl,'json',oData,true,TIMEOUT,function ok(msg){
        if(Type == 'read'){
            if(is_rk) {
                $(obj).siblings(".con-item-bottom").find(".my-envelope").html(' 已读');
                $(obj).siblings(".con-item-bottom").find(".icon-envelope .fa").removeClass("fa-envelope").addClass("fa-envelope-o");
            }else {
                Popup("操作成功");
                checkBoxs.siblings(".con-item-bottom").find(".my-envelope").html(' 已读');
                checkBoxs.siblings(".con-item-bottom").find(".icon-envelope .fa").removeClass("fa-envelope").addClass("fa-envelope-o");
            }
        }else {
            if(is_rk) {
                Popup("操作成功");
                if(rubhtml == ' 垃圾'){
                    $(obj).find(".my-rubbish").html(" 取消");
                }else{
                    $(obj).find(".my-rubbish").html(" 垃圾");
                }

            }
        }

    })
}

/**
 *   简报的加入或移动
 * @param e  event对象
 * @param obj   this 获取当前
 * @param is_classList  true 是列表中的单个添加或移动简报   false 是菜单上的批量操作 图标
 * @param id      容器id  判断是操作哪组
 * @returns {boolean}
 *
 */
function addBriefing(e,obj,is_classList,id){
    var othis = $(obj);
    var cloneDiv =$("#infoMoveList .infoMoveSelect").clone(true);   //复制出需要的简报列表 供以下调用
    othis.find(".addBriefingBox").empty();
    othis.find(".addBriefingBox").append(cloneDiv);
    othis.parents('.my-contlist').find(".addBriefingBox").hide();//将所有div隐藏
    if(is_classList){
        othis.find(".addBriefingBox").addClass('addBriefingBox-r');// 如果是列表上的添加  则加的样式
        var checkBoxs =$(obj).parents('.checkList').find('input');
    }else {
        othis.find(".addBriefingBox").addClass('addBriefingBox-l');// 如果是菜单上的添加  则加的样式
        var checkBoxs = $(id+" ul input[type='checkbox']:checked");
    }
    if (checkBoxs.length == 0) {
        layer.alert("至少选中一项进行操作", {
            skin: "jf-dialog",
            closeBtn: 0
        });
        return false;
    }
    othis.find(".addBriefingBox").show();
    $(document).one("click", function () {//对document绑定一个隐藏Div方法
        othis.find(".addBriefingBox").hide();
    });
    e.stopPropagation();//阻止事件冒泡到document
    othis.find(".addBriefingBox").bind("click", function(event){
        event.stopPropagation();//在Div区域内的点击事件阻止冒泡
    });
    var infoIds = "";
    for (var i = 0; i < checkBoxs.length; i++) {
        var o = $(checkBoxs[i]);
        infoIds += o.attr("collectinfoids") + SEPARATOR;
    }
    $(id+" .infoMoveSelect li").click(function(){
    var journalDefineId =$(this).attr("idname");
        var oData = {
            esInfoIds: Base64.encoder(infoIds), // base64加密
            journalDefineId: journalDefineId
        };
        var oUrl = URL + 'zh/collect/0/infomove.do?token=1';
    $p(oUrl,'json',oData,true,TIMEOUT,function ok(msg){
        Popup("操作成功！");
        othis.find(".addBriefingBox").hide();
    })
    });
}

/**
 * 专题 和 检索的 加入简报
 * @param e  event对象
 * @param obj   this 获取当前
 * @param is_classList  true 是列表中的单个添加或移动简报   false 是菜单上的批量操作 图标
 * @param id      容器id  判断是操作哪组
 * @returns {boolean}
 */
function addother(e,obj,is_classList,id) {
    var othis = $(obj);
    var cloneDiv =$("#infoMoveList .infoMoveSelect").clone(true);   //复制出需要的简报列表 供以下调用
    othis.find(".addBriefingBox").empty();
    othis.find(".addBriefingBox").append(cloneDiv);
    othis.parents('.my-contlist').find(".addBriefingBox").hide();//将所有div隐藏
    if(is_classList){
        othis.find(".addBriefingBox").addClass('addBriefingBox-r');// 如果是列表上的添加  则加的样式
        var checkBoxs =$(obj).parents('.checkList').find('input');
    }else {
        othis.find(".addBriefingBox").addClass('addBriefingBox-l');// 如果是菜单上的添加  则加的样式
        var checkBoxs = $(id+" ul input[type='checkbox']:checked");
    }
    if (checkBoxs.length == 0) {
        layer.alert("至少选中一项进行操作", {
            skin: "jf-dialog",
            closeBtn: 0
        });
        return false;
    }
    othis.find(".addBriefingBox").show();
    $(document).one("click", function () {//对document绑定一个隐藏Div方法
        othis.find(".addBriefingBox").hide();
    });
    e.stopPropagation();//阻止事件冒泡到document
    othis.find(".addBriefingBox").bind("click", function(event){
        event.stopPropagation();//在Div区域内的点击事件阻止冒泡
    });
    var infoIds = "";
    var infoTitles = "";
    var infoSummarys = "";
    var infoTimes = "";
    var infoHost = "";
    var infoIp = "";
    var infoEsIndex = "";
    var infoEsKeyword = "";
    for (var i = 0; i < checkBoxs.length; i++) {
        var o = $(checkBoxs[i]);
        infoIds += o.attr("infoId") + SEPARATOR;
        infoTitles += o.attr("infoTitle") + SEPARATOR;
        infoSummarys += o.attr("infoSummary") + SEPARATOR;
        infoTimes += o.attr("infoTime") + SEPARATOR;
        infoHost += o.attr("infoHost") + SEPARATOR;
        infoIp += o.attr("infoIp") + SEPARATOR;
        infoEsIndex += o.attr("infoEsIndex") + SEPARATOR;
        infoEsKeyword += o.attr("infoEsKeyword") + SEPARATOR;
    }
    $(id+" .infoMoveSelect li").click(function(){
        var journalDefineId =$(this).attr("idname");
            var oData = {
                journalDefineId: journalDefineId,
                infoId: Base64.encoder(infoIds),
                infoTitle: Base64.encoder(infoTitles),
                infoSummary: Base64.encoder(infoSummarys),
                infoTime: Base64.encoder(infoTimes),
                infoHost: Base64.encoder(infoHost),
                infoIp: infoIp,
                infoEsIndex: infoEsIndex,
                infoEsKeyword: infoEsKeyword
            };
            var oUrl = URL + 'zh/collect/0/add.do?token=1';
        $p(oUrl,'json',oData,true,TIMEOUT,function ok(msg){
            Popup("操作成功！");
            othis.find(".addBriefingBox").hide();
        })
    });
}

/**
 * 加入app
 */
function addToApp() {
        var checkBoxs = $("#seminar-contlist1 ul input[type='checkbox']:checked");

    if (checkBoxs.length == 0) {
        layer.alert("请先选择列表！", {
            skin: "jf-dialog",
            closeBtn: 0
        });
        return false;
    }
    var infoIds = "";

    for (var i = 0; i < checkBoxs.length; i++) {
        var o = $(checkBoxs[i]);
        infoIds += o.attr("infoId") + SEPARATOR;
    }

    var oData = {
        esIds: Base64.encoder(infoIds)
    };
    var oUrl = URL + 'zh/es/addAppSearch/ver.do?token=1';
    $p(oUrl,'json', oData, true, TIMEOUT, function ok(msg){Popup(msg.msg)});
}

/**
 * 加入收藏
 * @param id
 * @param si_this   是否是列表的单个收藏
 * @param obj
 * @returns {boolean}
 */
function addToFavorite(id,si_this,obj) {
    if(si_this){
        var checkBoxs =$(obj).parents('.checkList').find('input');
    }else{
        var checkBoxs = $(id + " ul input[type='checkbox']:checked");
    }
    if (checkBoxs.length == 0) {
        layer.alert("请先选择列表！", {
            skin: "jf-dialog",
            closeBtn: 0
        });
        return false;
    }
    var infoIds = "";
    var infoTitles = "";
    var infoSummarys = "";
    var infoTimes = "";
    var infoHost = "";
    var infoIp = "";
    var infoEsIndex = "";
    var infoEsKeyword = "";

    for (var i = 0; i < checkBoxs.length; i++) {
        var o = $(checkBoxs[i]);

        infoIds += o.attr("infoId") + SEPARATOR;
        infoTitles += o.attr("infoTitle") + SEPARATOR;
        infoSummarys += o.attr("infoSummary") + SEPARATOR;
        infoTimes += o.attr("infoTime") + SEPARATOR;
        infoHost += o.attr("infoHost") + SEPARATOR;
        infoIp += o.attr("infoIp") + SEPARATOR;
        infoEsIndex += o.attr("infoEsIndex") + SEPARATOR;
        infoEsKeyword += o.attr("infoEsKeyword") + SEPARATOR;
    }

    var oData = {
        infoId: Base64.encoder(infoIds),
        infoTitle: Base64.encoder(infoTitles),
        infoSummary: Base64.encoder(infoSummarys),
        infoTime: Base64.encoder(infoTimes),
        infoHost: Base64.encoder(infoHost),
        infoIp: infoIp,
        infoEsIndex: infoEsIndex,
        infoEsKeyword: infoEsKeyword
    };
    var oUrl = URL + 'zh/collect/0/add.do?token=1';
    $p(oUrl,'json', oData, true, TIMEOUT, function ok(msg){Popup(msg.msg)});
}

/**
 * 删除收藏夹
 *
 * @param DelId   id div
 * @param is_collect 是否在收藏夹栏内删除
 * @param fn    成功后执行的方法
 */
function delFavorite(DelId,is_collect,fn) {
    var colle = $(DelId+" .checkAll input[type='checkbox']:checked");
    var idAll = "";
    for (var i = 0, len = colle.length; i < len; i++) {
        var id = $(colle[i]).attr("deleteId");
        if (typeof(id) == "undefined") {
            continue;
        }
        idAll += id + SEPARATOR;
    }
    if(is_collect){
        var oUrl = URL + 'zh/collect/0/del.do?token=1';
        var oData = {
            collectInfoIds: Base64.encoder(idAll)
        };
    }else {
        var oUrl = URL + 'zh/journal/0/del.do?token=1';
        var oData = {
            collectInfoIds: Base64.encoder(idAll),
            journalDefineId:$(DelId).attr("idname")
        };
    }

    if (colle.length == 0) {
        layer.alert("至少选中一个列表删除！", {
            skin: "jf-dialog",
            closeBtn: 0
        });
    }else {
        $p(oUrl,'json', oData, true, TIMEOUT,function ok(msg){
            Popup(msg.msg);
            if(is_collect){
                fn(false,false)
            }else{
                fn(true)
            }
        })
    }
}


/**
 * 简报期刊定义接口--期刊添加
 */
function journaldefineAdd() {
    var name = $('#journaldefineName').val();
    var oData = {
        name: name
    };
    var oUrl = URL + 'zh/journaldefine/0/add.do?token=1';
    $p(oUrl,'json',oData,true,TIMEOUT,jianbao_menu_Ajax)
}

/**
 * 简报期刊定义接口--期刊更新
 */
function journaldefineUpdate() {
    var name = $('#journaldefineName').val();
    var id = $("#journaldefine").find(".a_on").attr("idname");
    var oData = {
        name: name
    };
    var oUrl = URL + 'zh/journaldefine/' + id + '/update.do?token=1';
    $p(oUrl,'json',oData,true,TIMEOUT,jianbao_menu_Ajax)
}

//通过简报id获取期刊信息
function getCollectInfoDefine() {
    var oUrl = URL + 'zh/journal/getobject/define.do?token=1';
    var oData = {
        journalDefineId : $("#journaldefine").find(".a_on").attr("idname")
    };
    $p(oUrl,'json',oData,true,TIMEOUT,function ok(msg){
        if(msg.data == undefined){
            Msg('你没有简报可完结！');
            return false
        }
        var id = msg.data.id;

        layer.open({
            title: '完结',
            type: 1,
            skin: 'jf-dialog', //样式类名
            shift: 2,
            area: ["500px", "250px"],
            shadeClose: true, //开启遮罩关闭
            content: $('#getCollectInfoDefine'),
            btn: ['保存', '取消'],
            yes: function(){
                var url =URL + 'zh/journal/0/update.do?token=1';
                var data ={
                    id:id,
                    number:$('#getCollectInfoDefine').find('.journal-number input').val(),
                    beginDateStr:$('#getCollectInfoDefine').find('.journal-beginDateStr input').val(),
                    endDateStr:$('#getCollectInfoDefine').find('.journal-endDateStr input').val()
                };
                $p(url,'json',data,true,TIMEOUT,function ok(msg){
                    Popup('操作成功！')
                    $("#journaldefine").find(".a_on").click();

                })
            }
        });
    });

}
//简报导出
function Download(){
        var colle = $("#seminar-contlist3 .checkAll input[type='checkbox']:checked");
        var idAll = "";
        for (var i = 0, len = colle.length; i < len; i++) {
            if(i>0){
                idAll +=",";
            }
            var id = $(colle[i]).attr("deleteId");
            if (typeof(id) == "undefined") {
                continue;
            }
            idAll += id;
        }
        if (colle.length == 0) {
            layer.alert("至少选中一个列表删除！", {
                skin: "jf-dialog",
                closeBtn: 0
            });
        }else {
            layer.open({
                content: '请选择以下格式的其中一种'
                ,skin: "jf-dialog"
                ,btn: ['excel', 'word']
                ,yes: function(index, layero){
                    var inUrl =URL + 'zh/collect/downloadToExcel.do?token=1';
                    var Data = {collectInfoIds: idAll};
                    var form = $("<form>");//定义一个form表单
                    form.attr("style", "display:none");
                    form.attr("target", "");
                    form.attr("method", "post");
                    form.attr("action", inUrl);
                    var input1 = $("<input>");
                    input1.attr("type", "hidden");
                    input1.attr("value",idAll);
                    input1.attr("name", "collectInfoIds");
                    $("body").append(form);//将表单放置在web中
                    form.append(input1);
                    form.submit();//表单提交
                    layer.close(index);
                    form.remove();
                },btn2: function(index, layero){
                    var inUrl =URL + 'zh/collect/downloadToWord.do?token=1';
                    var Data = {collectInfoIds: idAll};
                    var form = $("<form>");//定义一个form表单
                    form.attr("style", "display:none");
                    form.attr("target", "");
                    form.attr("method", "post");
                    form.attr("action", inUrl);
                    var input1 = $("<input>");
                    input1.attr("type", "hidden");
                    input1.attr("value",idAll);
                    input1.attr("name", "collectInfoIds");
                    $("body").append(form);//将表单放置在web中
                    form.append(input1);
                    form.submit();//表单提交
                }
            });
        }
}

//期刊完结的分期内容

function journalCon(obj) {
    var othis = $(obj).children('option:selected').val();
    var inData = {
        state: 2,
        token: "1",
        id: othis,
        currentIndex: 1,
        showRow: def_row_size
    };
    localData = inData;
    CLICK_Journal = othis;
    var inUrl = URL + 'zh/journal/0/getcollectinfo.do';
    var journalOption = $("#getCollectInfoPasted .getCollectInfoCopy select").find('option');
    $j(inUrl, 'json', localData, false, true, true, 30000, function ok(msg){
        var oData = msg.data;
        var oTotal = oData.count;   //总条数
        var oHtml = template("seminar-contlist-tpl3", oData);
        $("#seminar-contlist3").html(oHtml);
        $("#seminar-content ul .checkList input").checked = false;
        $("#seminar-contlist3 .seminar-tools-left .JournalAnd").remove();
        $("#seminar-contlist3 .seminar-tools-right .JournalDele").remove();
        $("#seminar-contlist3 .seminar-tools-right .Refresh").remove();

        if (oTotal == 0) {
            $(".nullContList3").show();
        }
        if (oTotal !== 0) {
            $("#jf-pagination").show();
            $("#jf-pagination").find(".total").html("共计" + oTotal + "条");

            $("#jf-pagination").find(".page-list").jqPaginator({
                totalCounts: oTotal,
                pageSize: def_row_size,
                visiblePages: 6,
                currentPage: 1,
                first: '<li class="first"><a href="javascript:void(0);">首页<\/a><\/li>',
                prev: '<li class="prev"><a href="javascript:void(0);">上一页<\/a><\/li>',
                next: '<li class="next"><a href="javascript:void(0);">下一页<\/a><\/li>',
                last: '<li class="last"><a href="javascript:void(0);">末页<\/a><\/li>',
                page: '<li class="page"><a href="javascript:void(0);">{{page}}<\/a><\/li>',
                onPageChange: function (n) {
                    if (localData.currentIndex != n) {
                        localData.currentIndex = n;
                        var inUrl = URL + 'zh/journal/0/getcollectinfo.do';
                        $j(inUrl, 'json', localData, false, true, true, 30000, function ok(msg) {
                            var oData = msg.data;
                            var oTotal = oData.count;   //总条数
                            var oHtml = template("seminar-contlist-tpl3", oData);
                            $("#seminar-contlist3").html(oHtml);
                            $("#seminar-contlist3 .seminar-tools-left .JournalAnd").remove();
                            $("#seminar-contlist3 .seminar-tools-right .JournalDele").remove();
                            $("#seminar-contlist3 .seminar-tools-right .Refresh").remove();
                        });
                        //获取期刊列表
                        getCollectInfoBox();
                        $("#getCollectInfoPasted .getCollectInfoCopy select").val(CLICK_Journal);
                        gCIDetailed();
                    }
                }
            });
        } else {
            $("#jf-pagination").hide();
        }
    });
    //获取期刊列表
    getCollectInfoBox();
    $("#getCollectInfoPasted .getCollectInfoCopy select").val(CLICK_Journal);

    //获取单个期刊信息
    gCIDetailed();
    function gCIDetailed(){
        var CoUrl = URL + 'zh/journal/0/getobject.do?token=1';
        var CoData ={
            id: othis
        };
        $j(CoUrl,'json', CoData,false,true, true, 30000,function ok(msg){
            var bData = msg.data.collect.beginDate;
            var eData = msg.data.collect.endDate;
            msg.data.collect.bgDate = dateUtil.dateFormat(bData,dateUtil.yyyyMMdd);
            msg.data.collect.edDate = dateUtil.dateFormat(eData,dateUtil.yyyyMMdd);
            var oHtml = template("gCIDtlBox-tpl", msg);
            $("#gCIDtlBox").html(oHtml);
            var cloneDiv =$("#gCIDtlBox .gCIDtlBoxCopy").clone(true);   //复制出需要的简报列表 供以下调用
            $("#gCIDtlPasted").empty();
            $("#gCIDtlPasted").append(cloneDiv);
        });
    }
    }
//新增函数
function topic_edit(isadd,id){
    var oData = {};
    oData["token"] = "subject";
    oData["name"] = $("#es-name").val();
    if ($("#trv_or[type='radio']").is(':checked')){
        oData["isOr"]=true;
    }else{
        oData["isOr"]=false;
    }
    if ($("#PutApp[type='radio']").is(':checked')){
        oData["publishToApp"]=1;
    }else{
        oData["publishToApp"]=0;
    }

    oData["esIndex"]= $("#es-index-id").val();
    oData["searchType"]= "";
    oData["titleMatchRegex"]=$("#titleMatchRegex").val();
    oData["titleNoMatchRegex"]=$("#titleNoMatchRegex").val();
    oData["contextMatchRegex"]=$("#contextMatchRegex").val();
    oData["contextNoMatchRegex"]=$("#contextNoMatchRegex").val();
    oData["groupId"]=$("#select_subject_groupId").val();
    oData["level"]=$("#es-level").val();
    if (!isNullStr(id)){
        oData["id"]=id;
    }
    if($("#es_seerch_type1[type='checkbox']").is(':checked')){
        oData["searchType"]+="1,";
    }
    if($("#es_seerch_type2[type='checkbox']").is(':checked')){
        oData["searchType"]+="2";
    }

    //简单校验
    if(oData["name"] == ""){
        layer.alert('请填上专题名称',{
            skin:"jf-dialog",
            closeBtn: 0
        });
        return false;
    }

    if(oData["esIndex"] == ""){
        layer.alert('请填上查询库',{
            skin:"jf-dialog",
            closeBtn: 0
        });
        return false;
    }

    if(oData["searchType"] == ""){
        layer.alert('请填上搜索类型',{
            skin:"jf-dialog",
            closeBtn: 0
        });
        return false;
    }
    if($("#es_seerch_type1[type='checkbox']").is(':checked')){
        if(oData["titleMatchRegex"] == ""){
            layer.alert('请填上标题匹配规则',{
                skin:"jf-dialog",
                closeBtn: 0
            });
            return false;
        }
    }
    if($("#es_seerch_type2[type='checkbox']").is(':checked')){
        if(oData["contextMatchRegex"] == ""){
            layer.alert('请填上内容匹配规则',{
                skin:"jf-dialog",
                closeBtn: 0
            });
            return false;
        }
    }
    var oUrl = isadd?URL+'zh/subject/0/add.do':URL+'zh/subject/0/update.do';
    $p(oUrl,'json', oData, true, TIMEOUT,function ok(msg){
        layer.alert(msg.msg,{
            skin:"jf-dialog",
            closeBtn: 0
        },function(){
            layer.closeAll();
            if(isadd){
                window.location.href = SEMINAR_INDEX;
            }else{
                var id = $('#group dd .a_on').attr("idname");
                window.location.href = SEMINAR_INDEX + '?type=subject&id=' + id;
            }

        });
    });
}