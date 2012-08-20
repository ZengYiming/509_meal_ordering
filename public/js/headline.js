/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-10
 * Time: 下午4:06
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
    setHeadLine();

    $("#homeDialog").dialog({
        autoOpen: false,
        modal: true,
        position: [530, 100]
    });

    //credit
    $('#credit').mouseenter(function() {
        $('#credit_sub').show();
    });
    $('#credit').mouseleave(function() {
        $('#credit_sub').hide();
    });

    //logo
    /*$('#logo').mouseenter(function() {
        $('#main').slideToggle(0);
    });
    $('#logo').mouseleave(function() {
        $('#main').slideToggle(0);
    });*/

    //user_info
    $('#user_info').mouseenter(function() {
        $.ajax({
            type:'get',
            url: '/user/index',
            dataType: 'html',
            global: false,
            async: false,
            success: function(data) {
                $('#user_info').html(data);
                $('#user_info_sub').show();
                $('#user_info').mouseleave(function() {
                    $('#user_info_sub').hide();
                });

                $('#user_info_change').click(function() {
                     $('#homeDialog').dialog({
                         open: function(event, ui) {
                            $(this).load('/user/change_info', function() {
                                //avatar_upload
                                var avatar = $('img#avatar');
                                avatar.mouseover(function() {
                                    avatar.css("border","2px dotted red");
                                });
                                avatar.mouseout(function() {
                                    avatar.css("border","none");
                                });
                                avatar.click(function() {
                                    $("#uploadinfo").css("visibility","hidden");
                                    $("#uploadarea").css("visibility","visible");
                                });

                                var imageUpload = $('#imageUpload').interval;
                                new AjaxUpload('avatarUpload', {
                                    action: '/user/upload_avatar',
                                    name: 'avatar',
                                    autoSubmit: true,
                                    responseType: 'json',
                                    onSubmit: function(file, extension) {
                                        //alert('onSubmit');
                                        $('div.preview').addClass('loading');
                                    },
                                    onComplete: function(file, response) {
                                        //alert('onComplete');
                                        /*avatar.load(function(){
                                            $('div.preview').removeClass('loading');
                                            avatar.unbind();
                                        });*/
                                        //var r = JSON.parse(response);
                                        avatar.attr('src', response.avatar_src);
                                        $("span#uploadinfo").text(response.message);
                                        $("span#uploadinfo").css("visibility","visible");
                                        $("span#uploadarea").css("visibility","hidden");
                                    }
                                });


                                //change_info
                                $('#user_info_submit').click(function() {
                                    var user_name = $('#user_name').val();
                                    var user_tel = $('#user_tel').val();
                                    var user_email = $('#user_email').val();
                                    var info_json = {name: user_name, tel: user_tel, email: user_email};
                                    $.ajax({
                                        type: "post",
                                        url:  "/user/change_info",
                                        dataType: "json",
                                        global: false,
                                        async: false,
                                        data: info_json,
                                        success: function (data, textStatus) {
                                            $().message("信息修改成功！");
                                            $("#homeDialog").dialog("close");
                                        },
                                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                                            var res = JSON.parse(XMLHttpRequest.responseText);
                                            $('p#error').html(res.error);//有错
                                        }
                                    });
                                });
                            });
                         },
                         title: '更改用户信息'
                     });
                    $('#homeDialog').dialog('open');
                    return false;
                });

                $('#user_info_psw').click(function() {
                    $('#homeDialog').dialog({
                        open: function(event, ui) {
                            $(this).load('/user/change_psw', function() {
                                $('#user_psw_submit').click(function() {
                                    var change_old_pass = $('#change_old_pass').val();
                                    var change_new_pass = $('#change_new_pass').val();
                                    var change_re_pass = $('#change_re_pass').val();
                                    var pass_json = {old_pass: change_old_pass, new_pass: change_new_pass, re_pass: change_re_pass};
                                    $.ajax({
                                        type: "post",
                                        url:  "/user/change_psw",
                                        dataType: "json",
                                        global: false,
                                        async: false,
                                        data: pass_json,
                                        success: function (data, textStatus) {
                                            $().message("密码修改成功！");
                                            $("#homeDialog").dialog("close");
                                        },
                                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                                            var res = JSON.parse(XMLHttpRequest.responseText);
                                            $('p#error').html(res.error);//有错
                                        }
                                    });
                                });
                            });
                        },
                        title: '重设密码'
                    });
                    $('#homeDialog').dialog('open');
                    return false;
                });
            },
            error: function() {
                $().message('获取信息失败！');
            }
        });
    });


    //shopping_cart
    $('#shopping_cart').mouseenter(function() {
        show_shopping_cart();
    });

    //orders
    $('#orders').mouseenter(function() {
        show_orders();
    });

    //resadm
    $('#resadm').mouseenter(function() {
        $.ajax({
            type: "get",
            url:  "/res_adm/get_res",
            dataType: "html",
            global: false,
            async: true,
            success: function (data, textStatus) {
//                console.log("data:"+JSON.stringify(data));
                $('#resadm').html(data);
                $('#resadm_sub').show();
                /*$('#resadm').mouseover(function() {
                    $('#resadm_sub').show();
                });*/
                $('#resadm').mouseleave(function() {
                    $('#resadm_sub').hide();
                });
            },
            error: function () {
                $().message("获取信息失败！");
            }
        });
    });

});

function setHeadLine() {
    $.ajax({
        type: "post",
        url:  "/headline/",
        dataType: "html",
        global: false,
        async: false,
        success: function (data, textStatus) {
//                console.log("data:"+JSON.stringify(data));
            $('#menu').html(data);
        },
        error: function () {
            $().message("获取信息失败！");
        }
    });
}

function show_shopping_cart() {
    $.ajax({
        type:'get',
        url: '/customer/shopping_cart',
        dataType: 'html',
        global: false,
        async: true,
        success: function(data) {
            $('#shopping_cart').html(data);
            $('#shopping_cart_sub').show();
            $('#shopping_cart').mouseleave(function() {
                $('#shopping_cart_sub').hide();
            });

            $('a#shopping_cart_del').click(function() {
                var dish_id = $(this).attr('name');
                $.ajax({
                    type:'get',
                    url: '/customer/shopping_cart_del?id=' + dish_id,
                    dataType: 'text',
                    global: false,
                    async: false,
                    success: function() {
                        show_shopping_cart();
                    },
                    error: function() {
                        $().message('获取信息失败！');
                    }
                });
            });

            $('a#shopping_cart_clear').click(function() {
                $.ajax({
                    type:'get',
                    url: '/customer/shopping_cart_clear',
                    dataType: 'text',
                    global: false,
                    async: false,
                    success: function() {
                        show_shopping_cart();
                    },
                    error: function() {
                        $().message('获取信息失败！');
                    }
                });
            });

            $('a#shopping_cart_buy').click(function() {
                $('#homeDialog').dialog({
                    open: function(event, ui) {
                        $(this).load('/customer/order_add', function() {
                            $('#order_add_submit').click(function() {
                                var rec_name = $('#rec_name').val();
                                var rec_tel = $('#rec_tel').val();
                                var rec_addr = $('#rec_addr').val();
                                var order_json = {rec_name: rec_name, rec_tel: rec_tel, rec_addr: rec_addr};
                                $.ajax({
                                    type: "post",
                                    url:  "/customer/order_add",
                                    dataType: "json",
                                    global: false,
                                    async: false,
                                    data: order_json,
                                    success: function (data, textStatus) {
                                        $().message("订单提交成功！");
                                        $("#homeDialog").dialog("close");
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        var res = JSON.parse(XMLHttpRequest.responseText);
                                        $('#error').html(res.error);//有错
                                    }
                                });
                            });
                        });
                    },
                    title: '填写订单'
                });
                $('#homeDialog').dialog('open');
                return false;
            });
        },
        error: function() {
            $().message('获取信息失败！');
        }
    });
}

function show_orders() {
    $.ajax({
        type:'get',
        url: '/customer/order_list',
        dataType: 'html',
        global: false,
        async: false,
        success: function(data) {
            $('#orders').html(data);
            $('#orders_sub').show();
            $('#orders').mouseleave(function() {
                $('#orders_sub').hide();
            });

            $('a#orders_del').click(function() {
                var order_id = $(this).attr('name');
                $.ajax({
                    type:'get',
                    url: '/customer/order_del/' + order_id,
                    dataType: 'text',
                    global: false,
                    async: false,
                    success: function() {
                        show_orders();
                    },
                    error: function() {
                        $().message('获取信息失败！');
                    }
                });
            });

            $('a#orders_info').click(function() {
                var order_id = $(this).attr('name');
                $('#homeDialog').dialog({
                    open: function(event, ui) {
                        $(this).load('/customer/order_info/' + order_id);
                    },
                    title: '订单详情'
                });
                $('#homeDialog').dialog('open');
                return false;
            });


        },
        error: function() {
            $().message('获取信息失败！');
        }
    });
}






