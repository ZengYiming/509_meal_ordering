/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-22
 * Time: 下午12:28
 * To change this template use File | Settings | File Templates.
 */
var colNames = ['店铺编号','店铺名称'];
//设置前台页面显示的表格数据
var colModel = [
    {name:'id',index:'id', width:250, align:"center",sortable:true},
    {name:'name',index:'name', width:300, align:"center",sortable:true}];
$(function(){
    var cus_id = $("#cus_id").val();
    jQuery("#authority_customer_info_table_delete").jqGrid({
        url:'/adm/authority_customer_info_delete/findall/'+cus_id,
        datatype: "json",
        mtype: 'GET',
        colNames:colNames,
        colModel:colModel,
        gridview:true, //加速显示
        multiselect: true,  //可多选，出现多选框
        multiselectWidth: 10, //设置多选列宽度
        rowNum:10,
        rowList:[10,20,30],
        pager: '#authority_customer_info_pager_delete',
        sortname: 'id',
        sortorder:'asc',
        viewrecords: true,
        caption:"店铺列表",
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
            $("p").appendTo($("#authority_customer_info_table_delete")).addClass("nodata").html('找不到相关数据！');
            $("#del_btn").attr("disabled",true);
        }
    });
    $("#delete").click(function(){
        var sels = $("#authority_customer_info_table_delete").jqGrid('getGridParam','selarrrow');
        if(sels==""){
            alert("请选择要管理的店铺！");
        }else{
            if(sels.toString().indexOf(',') > 0){
                alert("只可选择一项进行修改！");
            }else{
                if(confirm("您是否确认删除所选店铺的管理权限？")){
                    $.ajax({
                        type: "get",
                        url: "/adm/authority_customer_info/delete?cus_id="+cus_id+"&res_id="+sels,
                        success: function (data, textStatus) {
                            alert("删除店铺管理权限成功！");
                            //$("#popDialog").dialog("close");
                            $("#authority_customer_info_table_delete").jqGrid('delRowData',sels);
                            $('#authority_customer_info_table_delete').setGridParam({url:'/adm/authority_customer_info_delete/findall/'+cus_id});
                            $("#authority_customer_info_table_delete").trigger("reloadGrid", [{current:true}]);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            var res = JSON.parse(XMLHttpRequest.responseText);
                            alert(res.error);//有错
                        }
                    });
                }
            }
        }
    });
});