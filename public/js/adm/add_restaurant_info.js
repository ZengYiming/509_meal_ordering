/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-17
 * Time: 上午9:24
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-16
 * Time: 下午5:26
 * To change this template use File | Settings | File Templates.
 */
$(function(){
//    var sels = $("#change_restaurant_info_table").jqGrid('getGridParam','selarrrow');
//    var rowData = $("#change_restaurant_info_table").jqGrid("getRowData", sels);
//    $("#name").val(rowData.name);
//    $("#tel").val(rowData.tel);
//    $("#address").val(rowData.address);
//    $("#intro").val(rowData.intro);
//    $("#image").val(rowData.image);
    //提交表单进行保存
    $("#save").click(function(){
        //var id = rowData.id;
        var name = $("#name").val();
        var tel = $("#tel").val();
        var address = $("#address").val();
        var intro = $("#intro").val();
        var image = $("#img_src").val();

        var restaurant_json = {name:name, tel:tel, address:address, intro:intro,image:image};

        console.log("add_restaurant_json:"+JSON.stringify(restaurant_json));

        $.ajax({
            type: "post",
            url: '/adm/add_restaurant_info',
            dataType: "json",
            global: false,
            async: false,
            data: restaurant_json,
            success: function (data, textStatus) {
                alert("添加成功！");
                $("#popDialog").dialog("close");
                $("#change_restaurant_info_table").trigger("reloadGrid", [{current:true}]);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var res = JSON.parse(XMLHttpRequest.responseText);
                alert(res.error);//有错
            }
        });
    });
});