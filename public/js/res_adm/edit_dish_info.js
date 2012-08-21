/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-21
 * Time: 上午9:28
 * To change this template use File | Settings | File Templates.
 */
$(function(){
    var sels = $("#change_dish_info_table").jqGrid('getGridParam','selarrrow');
    var rowData = $("#change_dish_info_table").jqGrid("getRowData", sels);
    $("#name").val(rowData.name);
    $("#price").val(rowData.price);
    $("#intro").val(rowData.intro);
    $("#image").val(rowData.image);
    //提交表单进行保存
    $("#save").click(function(){
        var id=rowData.id;
        var name = $("#name").val();
        var price = $("#price").val();
        var intro = $("#intro").val();
        var res_id = $("#res_id").val();
        var image = $("#img_src").val();

        var dish_json = {id:id,name:name, price:price, intro:intro, res_id:res_id,image:image};

        console.log("edit_dish_json:"+JSON.stringify(dish_json));

        $.ajax({
            type: "post",
            url: '/res_adm/edit_dish_info/update',
            dataType: "json",
            global: false,
            async: false,
            data: dish_json,
            success: function (data, textStatus) {
                alert("添加成功！");
                $("#popDialog").dialog("close");
                $('#change_dish_info_table').setGridParam({url:'/res_adm/change_dish_info/findall/'+$("#res_id").val()});
                $("#change_dish_info_table").trigger("reloadGrid", [{current:true}]);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var res = JSON.parse(XMLHttpRequest.responseText);
                alert(res.error);//有错
            }
        });
    });
});