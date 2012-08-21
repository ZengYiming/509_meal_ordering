/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-20
 * Time: 下午5:05
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
        var price = $("#price").val();
        var intro = $("#intro").val();
        var res_id = $("#res_id").val();
        var image = $("#img_src").val();

        var dish_json = {name:name, price:price, intro:intro, res_id:res_id,image:image};

        console.log("add_dish_json:"+JSON.stringify(dish_json));

        $.ajax({
            type: "post",
            url: '/res_adm/add_dish_info',
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