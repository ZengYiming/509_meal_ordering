/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-20
 * Time: 上午9:45
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-14
 * Time: 下午2:58
 * To change this template use File | Settings | File Templates.
 */
//设置前台页面显示的表格列头
var colNames = ['编号', '菜品名称', '价格', '简要介绍','菜品图片'];
var colNames1 = ['编号', '用户编号', '提交时间', '状态','接收者姓名','接收者电话','接收者地址'];
//设置前台页面显示的表格数据
var colModel = [
    {name:'id',index:'id', width:100, align:"center",sortable:true},
    {name:'name',index:'name', width:200, align:"center",sortable:true},
    {name:'price',index:'price', width:100, align:"center",sortable:true},
    {name:'intro',index:'intro', width:200, align:"center",sortable:true},
    {name:'image',index:'image', width:200, align:"center",sortable:true}];
var colModel1 = [
    {name:'id',index:'id', width:100, align:"center",sortable:true},
    {name:'user_id',index:'user_id', width:100, align:"center",sortable:true},
    {name:'submit_time',index:'submit_time', width:200, align:"center",sortable:true},
    {name:'status',index:'status', width:200, align:"center",sortable:true},
    {name:'rec_name',index:'rec_name', width:200, align:"center",sortable:true},
    {name:'rec_tel',index:'rec_tel', width:200, align:"center",sortable:true},
    {name:'rec_addr',index:'rec_addr', width:200, align:"center",sortable:true}];
$(function(){
    var res_id = $("#res_id").val();
    //alert(res_id);
    jQuery("#change_dish_info_table").jqGrid({
        url:'/res_adm/change_dish_info/findall/'+res_id,
        datatype: "json",
        mtype: 'GET',
        colNames:colNames,
        colModel:colModel,
        gridview:true, //加速显示
        multiselect: true,  //可多选，出现多选框
        multiselectWidth: 25, //设置多选列宽度
        rowNum:10,
        rowList:[10,20,30],
        pager: '#change_dish_info_pager',
        sortname: 'id',
        sortorder:'asc',
        viewrecords: true,
        caption:"菜品列表",
        autowidth: true, //自动匹配宽度
        height: 300,
        prmNames : {
            rows:"limit" // 表示请求行数的参数名称
        },
        loadComplete:function(data){ //完成服务器请求后，回调函数
            var rowNum = parseInt($(this).getGridParam("records"), 10);
            if (rowNum <= 0) {
                alert("没有符合条件的记录！");
            }
//            console.log(data);
//            if(data.records == undefined  || data.records == 0){ //如果没有记录返回，追加提示信息，删除按钮不可用
//                $("p").appendTo($("#list")).addClass("nodata").html('找不到相关数据！');
//                $("#del_btn").attr("disabled",true);
//            }else{ //否则，删除提示，删除按钮可用
//                $("p.nodata").remove();
//                $("#del_btn").removeAttr("disabled");
//            }
        },
        loadError:function(xhr,status,error){
            $("p").appendTo($("#list")).addClass("nodata").html('找不到相关数据！');
            $("#del_btn").attr("disabled",true);
        }
    });
    $("#popDialog").dialog({
        autoOpen: false,
        modal: true,
        height: 600,
        width: 700,
        hide: 'fade',
        show: 'fade'
    });

    $("#add_btn").click(function(){
        $("#popDialog").dialog({
            open: function(event, ui) {
                $(this).load('/res_adm/change_dish_info/add',function() {
                    //dish_upload
                    var dish = $('img#dish');
                    dish.mouseover(function() {
                        dish.css("border","2px dotted red");
                    });
                    dish.mouseout(function() {
                        dish.css("border","none");
                    });
                    dish.click(function() {
                        $("#uploadinfo").css("visibility","hidden");
                        $("#uploadarea").css("visibility","visible");
                    });

                    var imageUpload = $('#imageUpload').interval;
                    new AjaxUpload('dishUpload', {
                        action: '/res_adm/change_dish_info/upload_dish',
                        name: 'dish',
                        autoSubmit: true,
                        responseType: 'json',
                        onSubmit: function(file, extension) {
                            //alert('onSubmit');
                            $('div.preview').addClass('loading');
                        },
                        onComplete: function(file, response) {
                            //alert('onComplete');
                            /*avatar.load(function(){
                             $('div.preview').removeClass('loading');
                             avatar.unbind();
                             });*/
                            //var r = JSON.parse(response);
                            dish.attr('src', response.dish_src);
                            $("#img_src").val(response.dish_src);
                            $("span#uploadinfo").text(response.message);
                            $("span#uploadinfo").css("visibility","visible");
                            $("span#uploadarea").css("visibility","hidden");
                        }
                    });
                });
            },
            title: '添加新菜品'
        });
        $("#popDialog").dialog("open");
        return false;
    });
    $("#edit_btn").click(function(){
        var sels = $("#change_dish_info_table").jqGrid('getGridParam','selarrrow');
        var rowData = $("#change_dish_info_table").jqGrid("getRowData", sels);
        var sel = rowData.id;
        if(sels==""){
            alert("请选择要修改的项！");
        }else{
            if(sels.toString().indexOf(',') > 0){
                alert("只可选择一项进行修改！");
            }else{
                $("#popDialog").dialog({
                    open: function(event, ui) {
                        $(this).load('/res_adm/change_dish_info/edit/'+sel,function() {
                            //dish_upload
                            var dish = $('img#dish');
                            dish.mouseover(function() {
                                dish.css("border","2px dotted red");
                            });
                            dish.mouseout(function() {
                                dish.css("border","none");
                            });
                            dish.click(function() {
                                $("#uploadinfo").css("visibility","hidden");
                                $("#uploadarea").css("visibility","visible");
                            });

                            var imageUpload = $('#imageUpload').interval;
                            new AjaxUpload('dishUpload', {
                                action: '/res_adm/change_dish_info/upload_dish',
                                name: 'dish',
                                autoSubmit: true,
                                responseType: 'json',
                                onSubmit: function(file, extension) {
                                    //alert('onSubmit');
                                    $('div.preview').addClass('loading');
                                },
                                onComplete: function(file, response) {
                                    //alert('onComplete');
                                    /*avatar.load(function(){
                                     $('div.preview').removeClass('loading');
                                     avatar.unbind();
                                     });*/
                                    //var r = JSON.parse(response);
                                    dish.attr('src', response.dish_src);
                                    $("#img_src").val(response.dish_src);
                                    $("span#uploadinfo").text(response.message);
                                    $("span#uploadinfo").css("visibility","visible");
                                    $("span#uploadarea").css("visibility","hidden");
                                }
                            });
                        });
                    },
                    title: '修改菜品信息'
                });
                $("#popDialog").dialog("open");
                return false;
            }
        }
    });
    $("#del_btn").click(function(){
        var sels = $("#change_dish_info_table").jqGrid('getGridParam','selarrrow');
        var sel = "";
        if(sels==""){
            alert("请选择要删除的项！");
        }else{
            if(confirm("您是否确认删除？")){
                var arr = sels.toString().split(',');
                $.each(arr,function(i,n){
                    if(arr[i]!=""){
                        var rowData = $("#change_dish_info_table").jqGrid("getRowData", arr[i]);
                        if(i == 0){
                            sel = rowData.id;
                        }
                        else{
                            sel = sel + ',' + rowData.id;
                        }
                    }
                });
                $.ajax({
                    type: "delete",
                    url: "/res_adm/change_dish_info/delete/"+sel,
                    //data: "_csrf=#{csrf}",
                    beforeSend: function() {
                        $().message("正在请求...");
                    },
                    error:function(){
                        $().message("请求失败...");
                    },
                    success: function(msg){
                        if(200 == msg.status){
                            $.each(arr,function(i,n){
                                if(arr[i]!=""){
                                    $("#change_dish_info_table").jqGrid('delRowData',arr[i]);
                                    $().message("已成功删除!");
                                }
                            });
                        }else{
                            $().message("操作失败！");
                        }
                    }
                });
            }
        }
    });

    jQuery("#change_order_info_table").jqGrid({
        url:'/res_adm/order/findall/'+res_id,
        datatype: "json",
        mtype: 'GET',
        colNames:colNames1,
        colModel:colModel1,
        gridview:true, //加速显示
        multiselect: true,  //可多选，出现多选框
        multiselectWidth: 25, //设置多选列宽度
        rowNum:10,
        rowList:[10,20,30],
        pager: '#change_order_info_pager',
        sortname: 'id',
        sortorder:'asc',
        viewrecords: true,
        caption:"菜品列表",
        autowidth: true, //自动匹配宽度
        height: 300,
        prmNames : {
            rows:"limit" // 表示请求行数的参数名称
        },
        loadComplete:function(data){ //完成服务器请求后，回调函数
            var rowNum = parseInt($(this).getGridParam("records"), 10);
            if (rowNum <= 0) {
                alert("没有符合条件的记录！");
            }
//            console.log(data);
//            if(data.records == undefined  || data.records == 0){ //如果没有记录返回，追加提示信息，删除按钮不可用
//                $("p").appendTo($("#list")).addClass("nodata").html('找不到相关数据！');
//                $("#del_btn").attr("disabled",true);
//            }else{ //否则，删除提示，删除按钮可用
//                $("p.nodata").remove();
//                $("#del_btn").removeAttr("disabled");
//            }
        },
        loadError:function(xhr,status,error){
            $("p").appendTo($("#list")).addClass("nodata").html('找不到相关数据！');
            $("#del_btn").attr("disabled",true);
        }
    });
    $("#popDialog1").dialog({
        autoOpen: false,
        modal: true,
        height: 600,
        width: 700,
        hide: 'fade',
        show: 'fade'
    });
    $("#diancai_btn").click(function(){
        var sels = $("#change_order_info_table").jqGrid('getGridParam','selarrrow');
        var rowData = $("#change_order_info_table").jqGrid("getRowData", sels);
        var order_id = rowData.id;
        if(sels==""){
            alert("请选择要查看的订单！");
        }else{
            if(sels.toString().indexOf(',') > 0){
                alert("只可选择一项进行查看！");
            }else{
                $("#popDialog1").dialog({
                    open: function(event, ui) {
                        $(this).load('/res_adm/order/dish?order_id='+order_id+"&res_id="+res_id);
                    },
                    title: '查看订单详细信息'
                });
                $("#popDialog1").dialog("open");
                return false;
            }
        }
    });
    $("#confirm_btn").click(function(){
        var sels = $("#change_order_info_table").jqGrid('getGridParam','selarrrow');
        var rowData = $("#change_order_info_table").jqGrid("getRowData", sels);
        var order_id = rowData.id;
        if(sels==""){
            alert("请选择要确认的订单！");
        }else{
            if(sels.toString().indexOf(',') > 0){
                alert("只可选择一项进行确认！");
            }else{
                $.ajax({
                    type: "get",
                    url: "/res_adm/order/confirm/"+order_id,
                    success: function (data, textStatus) {
                        alert("确认订单成功！");
                        //$("#popDialog").dialog("close");
                        //$("#change_order_info_table").jqGrid('delRowData',sels);
                        $('#change_order_info_table').setGridParam({url:'/res_adm/order/findall/'+res_id});
                        $("#change_order_info_table").trigger("reloadGrid", [{current:true}]);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var res = JSON.parse(XMLHttpRequest.responseText);
                        alert(res.error);//有错
                    }
                });
            }
        }
    });
    $("#cancel_btn").click(function(){
        var sels = $("#change_order_info_table").jqGrid('getGridParam','selarrrow');
        var rowData = $("#change_order_info_table").jqGrid("getRowData", sels);
        var order_id = rowData.id;
        if(sels==""){
            alert("请选择要取消的订单！");
        }else{
            if(sels.toString().indexOf(',') > 0){
                alert("只可选择一项进行取消！");
            }else{
                $.ajax({
                    type: "get",
                    url: "/res_adm/order/cancel/"+order_id,
                    success: function (data, textStatus) {
                        alert("取消订单成功！");
                        //$("#popDialog").dialog("close");
                        //$("#change_order_info_table").jqGrid('delRowData',sels);
                        $('#change_order_info_table').setGridParam({url:'/res_adm/order/findall/'+res_id});
                        $("#change_order_info_table").trigger("reloadGrid", [{current:true}]);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var res = JSON.parse(XMLHttpRequest.responseText);
                        alert(res.error);//有错
                    }
                });
            }
        }
    });
    $("#send_btn").click(function(){
        var sels = $("#change_order_info_table").jqGrid('getGridParam','selarrrow');
        var rowData = $("#change_order_info_table").jqGrid("getRowData", sels);
        var order_id = rowData.id;
        if(sels==""){
            alert("请选择要派送的订单！");
        }else{
            if(sels.toString().indexOf(',') > 0){
                alert("只可选择一项进行派送！");
            }else{
                $.ajax({
                    type: "get",
                    url: "/res_adm/order/send/"+order_id,
                    success: function (data, textStatus) {
                        alert("派送订单成功！");
                        //$("#popDialog").dialog("close");
                        //$("#change_order_info_table").jqGrid('delRowData',sels);
                        $('#change_order_info_table').setGridParam({url:'/res_adm/order/findall/'+res_id});
                        $("#change_order_info_table").trigger("reloadGrid", [{current:true}]);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var res = JSON.parse(XMLHttpRequest.responseText);
                        alert(res.error);//有错
                    }
                });
            }
        }
    });
    $("#success_btn").click(function(){
        var sels = $("#change_order_info_table").jqGrid('getGridParam','selarrrow');
        var rowData = $("#change_order_info_table").jqGrid("getRowData", sels);
        var order_id = rowData.id;
        if(sels==""){
            alert("请选择派送成功的订单！");
        }else{
            if(sels.toString().indexOf(',') > 0){
                alert("只可选择一项！");
            }else{
                $.ajax({
                    type: "get",
                    url: "/res_adm/order/success/"+order_id,
                    success: function (data, textStatus) {
                        alert("交易成功！");
                        //$("#popDialog").dialog("close");
                        //$("#change_order_info_table").jqGrid('delRowData',sels);
                        $('#change_order_info_table').setGridParam({url:'/res_adm/order/findall/'+res_id});
                        $("#change_order_info_table").trigger("reloadGrid", [{current:true}]);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var res = JSON.parse(XMLHttpRequest.responseText);
                        alert(res.error);//有错
                    }
                });
            }
        }
    });

});