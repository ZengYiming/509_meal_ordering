/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-14
 * Time: 下午2:58
 * To change this template use File | Settings | File Templates.
 */
//设置前台页面显示的表格列头
var colNames = ['编号', '店铺名称', '电话', '地址','简要介绍','店铺图片'];
//设置前台页面显示的表格数据
var colModel = [
    {name:'id',index:'id', width:100, align:"center",sortable:true},
    {name:'name',index:'name', width:200, align:"center",sortable:true},
    {name:'tel',index:'tel', width:100, align:"center",sortable:true},
    {name:'address',index:'address', width:200, align:"center",sortable:true},
    {name:'intro',index:'intro', width:200, align:"center",sortable:true},
    {name:'image',index:'image', width:200, align:"center",sortable:true}];
$(function(){
    jQuery("#change_restaurant_info_table").jqGrid({
        url:'/adm/change_restaurant_info/findall',
        datatype: "json",
        mtype: 'GET',
        colNames:colNames,
        colModel:colModel,
        gridview:true, //加速显示
        multiselect: true,  //可多选，出现多选框
        multiselectWidth: 25, //设置多选列宽度
        rowNum:10,
        rowList:[10,20,30],
        pager: '#change_restaurant_info_pager',
        sortname: 'id',
        sortorder:'asc',
        viewrecords: true,
        caption:"店铺列表",
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
});