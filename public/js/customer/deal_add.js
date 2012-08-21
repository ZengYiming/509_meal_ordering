/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-14
 * Time: 下午2:02
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
    $('#add_deal').click(function() {
        var quantity = $('#info_dish_quantity').val();
        var id = $('#info_dish_id').val();
        $.ajax({
            type: "post",
            url:  "/customer/shopping_cart_add",
            dataType: "html",
            global: false,
            async: false,
            data: {id: id, quantity: quantity},
            success:function (data, textStatus) {
//                console.log("data:"+JSON.stringify(data));
            $('#info').html(data);
        },
        error: function () {
            $().message("获取信息失败！");
        }
    });
    });

});


/*
function deal_add() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            document.getElementById('info').innerHTML = xmlhttp.responseText;
        }
       */
/* else {
            document.getElementById('tmp').innerHTML = '无权限进行此操作';
        }*//*

    }

    var quantity = document.getElementById('quantity').value;
    var id = document.getElementById('id').value;

    xmlhttp.open("post", "http://localhost:8888/customer/shopping_cart_add", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("id=" + id +  "&quantity=" + quantity);
    xmlhttp.send();

}*/
