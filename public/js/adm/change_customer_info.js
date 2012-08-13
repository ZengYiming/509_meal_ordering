/**
 * Created with JetBrains WebStorm.
 * User: Viya Bai
 * Date: 12-8-11
 * Time: 下午1:44
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-10
 * Time: 下午4:53
 * To change this template use File | Settings | File Templates.
 */
function update_img() {

}


//设置前台页面显示的表格列头
var colNames = ['编号', '用户名', '密码', '姓名','电话','电子邮件','头像'];
//设置前台页面显示的表格数据
var colModel = [
    {name:'id',index:'id', width:100, align:"center",sortable:true},
    {name:'username',index:'username', width:200, align:"center",sortable:true},
    {name:'password',index:'password', width:200, align:"center",sortable:true, hidden:true},
    {name:'name',index:'name', width:200, align:"center",sortable:true},
    {name:'tel',index:'tel', width:200, align:"center",sortable:true},
    {name:'email',index:'email', width:200,align:"center",sortable:true},
    {name:'image',index:'image', width:200, align:"center",sortable:true}];
$(function(){
    jQuery("#change_customer_info_table").jqGrid({
        url:'/adm/change_customer_info/findall',
        datatype: "json",
        mtype: 'GET',
        colNames:colNames,
        colModel:colModel,
        gridview:true, //加速显示
        multiselect: true,  //可多选，出现多选框
        multiselectWidth: 25, //设置多选列宽度
        rowNum:10,
        rowList:[10,20,30],
        pager: '#change_customer_info_pager',
        sortname: 'id',
        sortorder:'desc',
        viewrecords: true,
        caption:"用户列表",
        autowidth: true, //自动匹配宽度
        height: 300,
        prmNames : {
            rows:"limit" // 表示请求行数的参数名称
        }
//        loadComplete:function(data){ //完成服务器请求后，回调函数
//            console.log(data);
//            if(data.records == undefined  || data.records == 0){ //如果没有记录返回，追加提示信息，删除按钮不可用
//                $("p").appendTo($("#list")).addClass("nodata").html('找不到相关数据！');
//                $("#del_btn").attr("disabled",true);
//            }else{ //否则，删除提示，删除按钮可用
//                $("p.nodata").remove();
//                $("#del_btn").removeAttr("disabled");
//            }
//        },
//        loadError:function(xhr,status,error){
//            $("p").appendTo($("#list")).addClass("nodata").html('找不到相关数据！');
//            $("#del_btn").attr("disabled",true);
//        }
    });
//    var mydata = [
//        {id:"1",username:"polaris",password:"111",name:"polaris",tel:"123",email:"fef@163.com",image:""}];
//    for(var i=0;i<=mydata.length;i++)
//        jQuery("#change_customer_info_table").jqGrid('addRowData',i+1,mydata[i]);
//    $("#popDialog").dialog({
//        autoOpen: false,
//        modal: true,
//        height: 800,
//        width: 600
//    });
//
//    $("#show_type").click(function(){
////        $.fancybox({
////            'title':'商品类型管理',
////            'autoDimensions':false,
////            'type':'ajax',
////            'href':'/goods/type',
////            'width': 500,
////            'height': 600,
////            'modal':true,
////            'titleShow':true,
////            'titlePosition':'over',
////            'showCloseButton':true,
////            'showNavArrows':false,
////            'transitionIn': 'elastic',//（效果出入）属性值有三个：fade,elastic,none,含义分别为淡入淡出、弹性缩放、无，默认值为fade。
////            'transitionOut': 'elastic',
////            'centerOnScroll':false,
////            'onComplete': function() {$("#fancybox-title").css({'top':'0px', 'bottom':'auto'});}
////        });
//        $("#popDialog").dialog({
//            open: function(event, ui) {
//                $(this).load('/goods/type');
//            },
//            title: '商品类型管理'
//        });
//        $("#popDialog").dialog("open");
//        return false;
//    });
////    $("#popDialog").dialog({
////        autoOpen: false,
////        modal: true,
////        open: function ()
////        {
////            $(this).load('/goods/new');
////        },
////        height: 600,
////        width: 550,
////        title: '新增商品'
////    });
//
//    $("#add_btn").click(function(){
//        $("#popDialog").dialog({
//            open: function(event, ui) {
//                $(this).load('/goods/new');
//            },
//            title: '添加新员工'
//        });
//        $("#popDialog").dialog("open");
//        return false;
//    });
////    $("#add_btn111").click(function(){
////        $.fancybox({
////            'title':'新增商品',
////            'autoDimensions':false,
////            'type':'ajax',
////            'href':'/goods/new',
////            'width': 500,
////            'height': 600,
////            'modal':true,
////            'titleShow':true,
////            'titlePosition':'over',
////            'showCloseButton':true,
////            'showNavArrows':false,
////            'transitionIn': 'elastic',//（效果出入）属性值有三个：fade,elastic,none,含义分别为淡入淡出、弹性缩放、无，默认值为fade。
////            'transitionOut': 'elastic',
////            'centerOnScroll':false,
////            'onComplete': function() {$("#fancybox-title").css({'top':'0px', 'bottom':'auto'});}
////        });
////    });
//    $("#view_btn").click(function(){
//        var sels = $("#list").jqGrid('getGridParam','selarrrow');
//        if(sels==""){
//            $().message("请选择要查看的项！");
//        }else{
//            if(sels.toString().indexOf(',') > 0){
//                $().message("只可选择一项进行查看！");
//            }else{
////                $.fancybox({
////                    'title':'查看商品',
////                    'autoDimensions':false,
////                    'type':'ajax',
////                    'href':'/goods/view/'+sels,
////                    'width': 500,
////                    'height': 600,
////                    'modal':true,
////                    'titleShow':true,
////                    'titlePosition':'over',
////                    'cyclic': true,
////                    'showCloseButton':true,
////                    'showNavArrows':false,
////                    'transitionIn': 'elastic',//（效果出入）属性值有三个：fade,elastic,none,含义分别为淡入淡出、弹性缩放、无，默认值为fade。
////                    'transitionOut': 'elastic',
////                    'centerOnScroll':false,
////                    'onComplete': function() {$("#fancybox-title").css({'top':'0px', 'bottom':'auto'});}
////                });
//
//                $("#popDialog").dialog({
//                    open: function(event, ui) {
//                        $(this).load('/goods/view/'+sels);
//                    },
//                    title: '查看商品'
//                });
//                $("#popDialog").dialog("open");
//                return false;
//            }
//        }
//    });
//    $("#edit_btn").click(function(){
//        var sels = $("#list").jqGrid('getGridParam','selarrrow');
//        if(sels==""){
//            $().message("请选择要编辑的项！");
//        }else{
//            if(sels.toString().indexOf(',') > 0){
//                $().message("只可选择一项进行编辑！");
//            }else{
////                $.fancybox({
////                    'title':'修改商品',
////                    'autoDimensions':false,
////                    'type':'ajax',
////                    'href':'/goods/edit/'+sels,
////                    'width': 500,
////                    'height': 600,
////                    'modal':true,
////                    'titleShow':true,
////                    'titlePosition':'over',
////                    'cyclic': true,
////                    'showCloseButton':true,
////                    'showNavArrows':false,
////                    'transitionIn': 'elastic',//（效果出入）属性值有三个：fade,elastic,none,含义分别为淡入淡出、弹性缩放、无，默认值为fade。
////                    'transitionOut': 'elastic',
////                    'centerOnScroll':false,
////                    'onComplete': function() {$("#fancybox-title").css({'top':'0px', 'bottom':'auto'});}
////                });
//                $("#popDialog").dialog({
//                    open: function(event, ui) {
//                        $(this).load('/goods/edit/'+sels);
//                    },
//                    title: '修改商品'
//                });
//                $("#popDialog").dialog("open");
//                return false;
//            }
//        }
//    });
//    $("#del_btn").click(function(){
//        var sels = $("#list").jqGrid('getGridParam','selarrrow');
//        if(sels==""){
//            $().message("请选择要删除的项！");
//        }else{
//            if(confirm("您是否确认删除？")){
//                $.ajax({
//                    type: "delete",
//                    url: "/goods/"+sels,
//                    data: "_csrf=#{csrf}",
//                    beforeSend: function() {
//                        $().message("正在请求...");
//                    },
//                    error:function(){
//                        $().message("请求失败...");
//                    },
//                    success: function(msg){
//                        if(200 == msg.status){
//                            var arr = msg._ids.split(',');
//                            $.each(arr,function(i,n){
//                                if(arr[i]!=""){
//                                    $("#list").jqGrid('delRowData',n);
//                                }
//                            });
//                            $().message("已成功删除!");
//                        }else{
//                            $().message("操作失败！");
//                        }
//                    }
//                });
//            }
//        }
//    });
//    $("#find_btn").click(function(){
//        var obj = new Object();
//        $(".query_input").each(function(){
//            var key = $(this).attr('id');
//            var value = $(this).val();
//            obj[key] = value;
//        });
//        $("#list").jqGrid('setGridParam',{
//            url:"/goods/index",
//            postData:obj,
//            page:1
//        }).trigger("reloadGrid");
//    });
});