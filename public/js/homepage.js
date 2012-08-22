/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-22
 * Time: 上午11:11
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
    show_homepage();
});

function show_homepage() {
    $.ajax({
        type: "get",
        url:  "/homepage",
        dataType: "html",
        global: false,
        async: true,
        success: function (data, textStatus) {
//                console.log("data:"+JSON.stringify(data));
            $('#main_container').html(data);
            $('#main_container').imagesLoaded(function() {
                $('#main_container').BlocksIt({
                    numOfCol: 3,
                    offsetX: 8,
                    offsetY: 8
                });
            });

            $('a.res_img').click(function() {
                var res_id = $(this).attr('name');
                //alert('res_id: ' + res_id);
                $.ajax({
                    type: "get",
                    url:  "/dish_list/" + res_id,
                    dataType: "html",
                    global: false,
                    async: false,
                    success: function (data, textStatus) {
                        $('#main_container').html(data);
                        $('#main_container').imagesLoaded(function() {
                            $('#main_container').BlocksIt({
                                numOfCol: 4,
                                offsetX: 8,
                                offsetY: 8
                            });
                        });
                        $('.dish_img').fancybox({
                            /*type:'image',
                             autoSize : true,
                             openEffect	: 'elastic',
                             closeEffect	: 'elastic',
                             helpers : {
                             title : {
                             type : 'inside'
                             }
                             }*/
                        });
                        $('.dish_info_btn').fancybox();
                    },
                    error: function () {
                        $().message("获取信息失败！");
                    }
                });
            });
        },
        error: function () {
            $().message("获取信息失败！");
        }
    });
}