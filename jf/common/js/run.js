function topfn(){
    var oTrue = true;
    if(oTrue){

        $("#top").find("ul").hide();
        $("#top").find(".user-bar").show();
    }
}



$(function(){

    //头部
    ajaxHtml($("#jf-top"),function(){
        topfn();
    });


    //menu
    ajaxHtml($("#jf-menu"),function(){
        var oTarget = $(".menu-bar").attr("target");
        $(".menu-navUl").find("li").removeClass("on");
        $(".menu-navUl").find("li").eq(oTarget).addClass("on");

        $(".menu-navUl").find("li").hover(function(){
            $(".menu-navUl").attr("athis","1");
            $(".menu-navUl").find("li").removeClass("on");
            $(this).addClass("on");
        },function(){
            $(".menu-navUl").attr("athis","0");
            $(this).removeClass("on");
            if($(".menu-navUl").attr("athis")=="0"){
                $(".menu-navUl").find("li").eq(oTarget).addClass("on");
            }
        })
    });

    //tree
    if($("#jf-tree").length>0){
        ajaxHtml($("#jf-tree"),function(){
            //
            jfAjax('tree.json',function(msg){
                if(msg.state == 0){
                    
                    var oHtml = template("tree-menu-tpl",msg);
                    $("#tree-menu").html(oHtml);
                    treeLeft();
                    $("#tree-menu").find("dl").eq(0).find("dt").click();
                }else{
                    alert("程序错误！");
                }
            })
        })
    }


})