/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-15
 * Time: 下午3:36
 * To change this template use File | Settings | File Templates.
 */

$(function(){
    var sels = $("#change_customer_info_table").jqGrid('getGridParam','selarrrow');
    var rowData = $("#change_customer_info_table").jqGrid("getRowData", sels);
    $("#username").val(rowData.username);
    $("#password").val(rowData.password);
    $("#name").val(rowData.name);
    $("#tel").val(rowData.tel);
    $("#email").val(rowData.email);
    $("#image").val(rowData.image);
        //提交表单进行保存
    $("#save").click(function(){
        var id = rowData.id;
        var username = $("#username").val();
        var password = $("#password").val();
        var name = $("#name").val();
        var tel = $("#tel").val();
        var email = $("#email").val();
        var image = $("#image").val();

        var user_json = {id:id,username:username, password:password, name:name, tel:tel, email:email,image:image};

        console.log("user_json:"+JSON.stringify(user_json));

        $.ajax({
            type: "post",
            url: '/adm/edit_customer_info/update',
            dataType: "json",
            global: false,
            async: false,
            data: user_json,
            success: function (data, textStatus) {
                $().message("修改成功！");
                $("#popDialog").dialog("close");
                $("#change_customer_info_table").trigger("reloadGrid", [{current:true}]);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var res = JSON.parse(XMLHttpRequest.responseText);
                $().message(res.error);//有错
            }
        });
    });
});

