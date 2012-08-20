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
//设置前台页面显示的表格数据
var colModel = [
    {name:'id',index:'id', width:100, align:"center",sortable:true},
    {name:'name',index:'name', width:200, align:"center",sortable:true},
    {name:'price',index:'price', width:100, align:"center",sortable:true},
    {name:'intro',index:'intro', width:200, align:"center",sortable:true},
    {name:'image',index:'image', width:200, align:"center",sortable:true}];
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
            console.log(data);
            if(data.records == undefined  || data.records == 0){ //如果没有记录返回，追加提示信息，删除按钮不可用
                $("p").appendTo($("#list")).addClass("nodata").html('找不到相关数据！');
                $("#del_btn").attr("disabled",true);
            }else{ //否则，删除提示，删除按钮可用
                $("p.nodata").remove();
                $("#del_btn").removeAttr("disabled");
            }
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
                $(this).load('/res_adm/change_dish_info/add');
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
                        $(this).load('/res_adm/change_dish_info/edit/'+sel);
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
});