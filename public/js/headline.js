/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-10
 * Time: 下午4:06
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
    setHeadLine();
});

function setHeadLine() {
    $.ajax({
        type: "post",
        url:  "http://localhost:8888/headline/",
        dataType: "html",
        global: false,
        async: false,
        success: function (data, textStatus) {
//                console.log("data:"+JSON.stringify(data));
            $('#menu').append(data);
        },
        error: function () {
            $().message("获取信息失败！");
        }
    });
}


