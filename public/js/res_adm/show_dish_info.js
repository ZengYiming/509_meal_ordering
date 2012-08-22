/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-22
 * Time: 下午4:35
 * To change this template use File | Settings | File Templates.
 */
var colNames = ['菜品编号','菜品名称'];
//设置前台页面显示的表格数据
var colModel = [
    {name:'id',index:'id', width:250, align:"center",sortable:true},
    {name:'name',index:'name', width:300, align:"center",sortable:true}];
$(function(){
    var order_id = $("#order_id").val();
    var res_id= $("#res_id").val();
    jQuery("#show_dish_info_table").jqGrid({
        url:'/res_adm/order/dish/findall?order_id='+order_id+"&res_id="+res_id,
        datatype: "json",
        mtype: 'GET',
        colNames:colNames,
        colModel:colModel,
        gridview:true, //加速显示
        multiselect: true,  //可多选，出现多选框
        multiselectWidth: 10, //设置多选列宽度
        rowNum:10,
        rowList:[10,20,30],
        pager: '#show_dish_info_pager',
        sortname: 'id',
        sortorder:'asc',
        viewrecords: true,
        caption:"菜品列表",
        //autowidth: true, //自动匹配宽度
        height: 450,
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
//                $("p").appendTo($("#authority_customer_info_table")).addClass("nodata").html('找不到相关数据！');
//                $("#del_btn").attr("disabled",true);
//                alert("没有店铺！");
//            }else{ //否则，删除提示，删除按钮可用
//                $("p.nodata").remove();
//                $("#del_btn").removeAttr("disabled");
//            }
        },
        loadError:function(xhr,status,error){
            $("p").appendTo($("#show_dish_info_table")).addClass("nodata").html('找不到相关数据！');
            $("#del_btn").attr("disabled",true);
        }
    });
});