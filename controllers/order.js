/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-14
 * Time: 下午4:11
 * To change this template use File | Settings | File Templates.
 */

var models = require("../models");
var Order = models.Order;
var Order_dish = models.Order_dish;
var Dish = models.Dish;
var Restaurant = models.Restaurant;

var MQClient = require('../libs/mq_client.js');

var url = require('url');
var EventProxy = require('eventproxy').EventProxy;
var sanitize = require('validator').sanitize;
var sys = require('sys');

exports.show_info = function(req, res, next) {
    //var order_id = url.parse(req.url, true).query.order_id;
    var order_id = req.params.order_id;

    var ep = EventProxy.create();
    ep.assign('findOrder', 'findDishes', function(order, dishes) {
        res.render('customer/order_info', {layout: false, order: order, dishes: dishes});
        //console.log("in order show_info, dishes: " + sys.inspect(dishes));
    });

    Order.findOne({id: order_id}, function(err, result) {
        if(err) return next(err);
        ep.trigger('findOrder', result);
    });
    Order_dish.findAll({where: 'AND order_id=' + order_id}, function(err, result) {
        if(err) return next(err);
        var dishes = [];
        ep.after('getDish', result.length, function() {
            ep.trigger('findDishes', dishes);
        });
        for(var k in result) {
            var value = result[k];
            //console.log("in order show_info, value: " + sys.inspect(value));
            query_dish(value);
        }
        function query_dish(value) {
            Dish.findOne({id: value.dish_id}, function(err, dish) {
                //console.log("in order show_info, result[k]: " + sys.inspect(result[k]));
                if(err) return next(err);
                var rest_id = dish.restaurant_id;
                Restaurant.findOne({id: rest_id}, function(err, rest) {
                    if(err) return next(err);
                    if(rest) {
                        dish.restaurant_name = rest.name;
                        dish.quantity = value.quantity;
                        //console.log("in order show_info, dish: " + sys.inspect(dish));
                        dishes.push(dish);
                        ep.trigger('getDish');
                    }
                });
            });
        }
    });
};

exports.show_list = function(req, res, next, error) {
    var user = req.session.user;
    Order.findAll({where: 'AND user_id=' + user.id}, function(err, orders) {
        if(err) return next(err);

     //   console.log("orders: " + sys.inspect(orders));
        var content = '我的订单';
        if(!orders || orders.length == 0) {
            content += '<ul id="orders_sub">' +
                '<li>' +
                '<img class="corner_inset_left" alt="" src="/image/headline/corner_inset_left.png"/>' +
                '<p>无订单</p>' +
                '<img class="corner_inset_right" alt="" src="/image/headline/corner_inset_right.png"/>'+
                '</li>' +
                '<li class="last">' +
                '<img class="corner_left" alt="" src="/image/headline/corner_left.png"/>' +
                '<img class="middle" alt="" src="/image/headline/dot.gif"/>' +
                '<img class="corner_right" alt="" src="/image/headline/corner_right.png"/>' +
                '</li>' +
                '</ul>';
            res.write(content);
            res.end();
            return;
        }
        content += '<ul id="orders_sub">' +
            '<li>' +
            '<img class="corner_inset_left" alt="" src="/image/headline/corner_inset_left.png"/>' +
            '<img class="corner_inset_right" alt="" src="/image/headline/corner_inset_right.png"/>'+
            '</li>' +
            '<li><table><tr><th>订单号</th><th>订单状态</th><th>提交日期</th><th></th></tr>';

        for(var k in orders) {
            var value = orders[k];
            var status = '', del = '';
            switch(value.status){
                case 0:
                    status = '无法完成';
                    break;
                case 1:
                    status = '订单已提交';
                    break;
                case 2:
                    status = '制作中';
                    break;
                case 3:
                    status = '派送中';
                    break;
                case 4:
                    status = '完成交易';
                    break;
            }
            if(value.status == 1) {
                del = '<a id="orders_del" name=' + value.id + '>删除</a>';
            }
            content += '<tr><td><a id="orders_info" name="' + value.id + '">' + value.id + '</a></td><td>' + status + '</td><td>' + value.submit_time + '</td>' +
                '<td>' + del + '</td></tr>';
        }
        content += '</table></li>' +
            '<li class="last">' +
            '<img class="corner_left" alt="" src="/image/headline/corner_left.png"/>' +
            '<img class="middle" alt="" src="/image/headline/dot.gif"/>' +
            '<img class="corner_right" alt="" src="/image/headline/corner_right.png"/>' +
            '</li>' +
            '</ul>';
        res.write(content);
        res.end();
        return;

        //res.render('customer/order_list', {error: error, orders: orders});
    });

};

exports.add = function(req, res, next) {
    /*function feedback(err, opt) {
        if(opt) {
            res.render('customer/order_add', {layout: false, error: err, deals: req.session.shopping_cart, gross: req.session.shopping_gross, rec_name: opt.rec_name, rec_tel: opt.rec_tel, rec_addr: opt.rec_addr});
        }else {
            res.render('customer/order_add', {layout:false, error: err, deals: req.session.shopping_cart, gross: req.session.shopping_gross});
        }

        return;
    }*/
    var method = req.method.toLowerCase();
    if(method == 'get') {
        /*if(req.session.shopping_cart.length == 0) {
            var err = '购物车是空的。'
            feedback(err);
        }
        feedback();*/
        res.render('customer/order_add', {layout:false, deals: req.session.shopping_cart, gross: req.session.shopping_gross});
    }
    if(method == 'post') {
        var ep = EventProxy.create();
        ep.on('create_done', function() {
            clear_shopping_cart();
        });
        ep.on('done', function() {
            //exports.show_list(req, res, next, '订单提交成功');
            //MQClient.sub('UserLogin', UserLogin);
            for(var k in res_obj) {
                MQClient.pub('new_order' + k, '有新订单');
            }
            res.json({}, 200);
            return;
        });


        var rec_name = sanitize(req.body.rec_name).trim();
        var rec_tel = sanitize(req.body.rec_tel).trim();
        var rec_addr = sanitize(req.body.rec_addr).trim();

        if(rec_name == '' || rec_tel == '' || rec_addr == '') {
            //feedback('信息不完整', {rec_name: rec_name, rec_tel:rec_tel, rec_addr: rec_addr});
            res.json({status: 412, error: '信息不完整'}, 412);
            return;
        }
        var user = req.session.user;
        var date = new Date();
        var dateTime = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        //console.log("in order.js, dateTime: " + dateTime);
        var order_body = {user_id: user.id, submit_time: dateTime, status: 1, rec_name: rec_name, rec_tel: rec_tel, rec_addr: rec_addr};
        var res_obj = {},
            order_ids = [],
            res_obj_length = 0;
        for(var k in req.session.shopping_cart) {
            var dish = req.session.shopping_cart[k].dish;
            var quantity = req.session.shopping_cart[k].quantity;
            var res_id = dish.restaurant_id;
            (res_obj[res_id] = res_obj[res_id] || []).push({dish_id: dish.id, quantity: quantity});
        }
        for(var k in res_obj) {
            res_obj_length += 1;
        }
        //console.log('res_obj: ' + sys.inspect(res_obj));
        //console.log('res_obj.length: ' + res_obj_length);
        ep.after('order', res_obj_length, function() {
            create_od();
        });
        for(var k in res_obj) {
            Order.create(order_body, function(err, info) {
                if(err) return next(err);
                if(info) {
                    order_ids.push(info.insertId);
                    ep.trigger('order');
                }
            });
        }

        function create_od() {
            ep.after('create_od_done', res_obj_length, function() {
                ep.trigger('create_done');
            });
            //console.log('order_ids: ' + sys.inspect(order_ids));
            var num = 0
            for(var k in res_obj) {
                var dish_objs = res_obj[k];
                var order_id = order_ids[num];
                num += 1;
                ep.after('create_od', dish_objs.length, function() {
                    ep.trigger('create_od_done');
                });
                for(var i in dish_objs) {
                    var dish_obj = dish_objs[i];
                    var od_body = {order_id: order_id, dish_id: dish_obj.dish_id, quantity: dish_obj.quantity};
                    Order_dish.create(od_body, function(err, info) {
                        if(err) return next(err);
                        ep.trigger('create_od');
                    });
                }
                //console.log('dish_objs: ' + sys.inspect(dish_objs));
            }
        }

        function clear_shopping_cart() {
            delete req.session.shopping_cart;
            delete req.session.shopping_gross;
            ep.trigger('done');
        }
    }
};

exports.del = function(req, res, next) {
    //var order_id = url.parse(req.url, true).query.order_id;
    var order_id = req.params.order_id;
    Order.delete(order_id, function(err, rs) {
        if(err) return next(err);
        //exports.show_list(req, res, next, '订单删除成功');
        res.write('');
        res.end();
    });
};


exports.findallorder = function(req, res, next){
    var page = req.query.page;//起始行数 for jqgrid
    var start = req.query.start;//起始行数
    var limit = req.query.limit;//每页显示行数
    var bt = req.query.bt;//交易发生时间起点
    var et = req.query.et;//交易发生截至时间
    var sidx = req.query.sidx;//排序字段名
    var sord = req.query.sord;//排序方式
    var type_id = req.query.type_id;//商品类型ID
    var ep = EventProxy.create();

    var res_id = req.params.id;
    //根据前台页面传入的查询条件，开始拼接where语句
    var where = ' and id in (select order_id from order_dish where dish_id in (select id from dish where restaurant_id='+res_id+'))';

    function feedback(result) {
        if(200 == result.status) {
            if(result.jsonObj) {
//                var jsonStr = JSON.stringify(result.jsonObj);
//                console.log('jsonStr:'+jsonStr);
                return res.json(result.jsonObj, result.status);
            }else{
                ep.trigger('error', {status:204, error:'查询结果为空!'});
            }
        }
        else {
            return res.json(result, result.status);
        }
    };

    //当有异常发生时触发
    ep.once('error', function(result) {
        ep.unbind();//remove all event
        return feedback(result);
    });
    ep.on('findAllForWeb', function(where, count) {
        findAllForWeb(where, count);
    });

    Order.count({where:where, bt:bt, et:et}, function(err, count) {
        if(err) { ep.unbind(); return next(err);}
        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});
        ep.trigger('findAllForWeb', where, count.count);
    });

    function findAllForWeb(where, count) {
        var showElement = ['id', 'user_id', 'submit_time', 'status', 'rec_name','rec_tel','rec_addr'];
        var state = ['无法制作','订单已提交','菜品制作中','派送中','完成交易'];

        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});

        if(!sidx){
            sidx = 1;
        }

        // 查询结果总页数
        var total_pages = 0;

        // 计算查询结果页数
        if(count > 0 && limit > 0){
            total_pages = Math.ceil(count/limit);
        }

        // 若请求页大于总页数，设置请求页为最后一页
        if (page > total_pages) page = total_pages;

        // 计算起始行
        var start = limit * page - limit;
        // 若起始行为0
        if(start < 0) start = 0;

        Order.findAll({where:where, start:start, limit:limit, sidx:sidx, sord:sord, bt:bt, et:et}, function(err, rs) {
            if(err) { ep.unbind(); return next(err);}
            if (!rs || rs == undefined) return ep.trigger('error', {status:204, error:'查询结果为空！'});
            //开始汇总
            var jsonObj = new Object();

            jsonObj.page = page;  // 当前页
            jsonObj.total = total_pages;    // 总页数
            jsonObj.records = count;  // 总记录数

            //定义rows 数组，保存所有rows数据
            var rowsArray = new Array();
            for(var i=0; i<rs.length; i++){
                // 定义rows
                var rows = new Object();
                rows.id = rs[i].id;
                //rows.cell = rs[i];
                var ay = new Array();
                for(key in rs[i]){
                    var index = showElement.indexOf(key);
                    if(index >= 0){
                        if(index == 3){
                            ay[index] = state[rs[i][key]];
                        }
                        else{
                            ay[index] = rs[i][key];
                        }
                    }
                }
                rows.cell = ay;
                rowsArray[i] = rows;
            }
            //将rows数组赋予jsonObj.rows
            jsonObj.rows = rowsArray;

            var jsonStr = JSON.stringify(jsonObj);
            console.log('jsonStr-dishes:'+jsonStr);
            return res.json(jsonObj, 200);

        });
    };
};
exports.showdish = function(req, res, next){
    var order_id = req.query.order_id;
    var res_id = req.query.res_id;
    res.render('res_adm/show_dish_info',{layout:false,order_id:order_id,res_id:res_id});
};
exports.finddish = function(req, res, next){
    var order_id = req.query.order_id;
    var res_id = req.query.res_id;

    var page = req.query.page;//起始行数 for jqgrid
    var start = req.query.start;//起始行数
    var limit = req.query.limit;//每页显示行数
    var bt = req.query.bt;//交易发生时间起点
    var et = req.query.et;//交易发生截至时间
    var sidx = req.query.sidx;//排序字段名
    var sord = req.query.sord;//排序方式
    var type_id = req.query.type_id;//商品类型ID
    var ep = EventProxy.create();
    //根据前台页面传入的查询条件，开始拼接where语句
    var where = ' and restaurant_id='+res_id+' and id in (select dish_id from order_dish where order_id='+order_id+')';

    function feedback(result) {
        if(200 == result.status) {
            if(result.jsonObj) {
//                var jsonStr = JSON.stringify(result.jsonObj);
//                console.log('jsonStr:'+jsonStr);
                return res.json(result.jsonObj, result.status);
            }else{
                ep.trigger('error', {status:204, error:'查询结果为空!'});
            }
        }
        else {
            return res.json(result, result.status);
        }
    };

    //当有异常发生时触发
    ep.once('error', function(result) {
        ep.unbind();//remove all event
        return feedback(result);
    });
    ep.on('findAllForWeb', function(where, count) {
        findAllForWeb(where, count);
    });

    Dish.count({where:where, bt:bt, et:et}, function(err, count) {
        if(err) { ep.unbind(); return next(err);}
        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});
        ep.trigger('findAllForWeb', where, count.count);
    });

    function findAllForWeb(where, count) {
        var showElement = ['id', 'name'];
        //var state = ['无法制作','订单已提交','菜品制作中','派送中','完成交易'];

        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});

        if(!sidx){
            sidx = 1;
        }

        // 查询结果总页数
        var total_pages = 0;

        // 计算查询结果页数
        if(count > 0 && limit > 0){
            total_pages = Math.ceil(count/limit);
        }

        // 若请求页大于总页数，设置请求页为最后一页
        if (page > total_pages) page = total_pages;

        // 计算起始行
        var start = limit * page - limit;
        // 若起始行为0
        if(start < 0) start = 0;

        Dish.findAll({where:where, start:start, limit:limit, sidx:sidx, sord:sord, bt:bt, et:et}, function(err, rs) {
            if(err) { ep.unbind(); return next(err);}
            if (!rs || rs == undefined) return ep.trigger('error', {status:204, error:'查询结果为空！'});
            //开始汇总
            var jsonObj = new Object();

            jsonObj.page = page;  // 当前页
            jsonObj.total = total_pages;    // 总页数
            jsonObj.records = count;  // 总记录数

            //定义rows 数组，保存所有rows数据
            var rowsArray = new Array();
            for(var i=0; i<rs.length; i++){
                // 定义rows
                var rows = new Object();
                rows.id = rs[i].id;
                //rows.cell = rs[i];
                var ay = new Array();
                for(key in rs[i]){
                    var index = showElement.indexOf(key);
                    if(index >= 0){
                        if(index == 3){
                            ay[index] = state[rs[i][key]];
                        }
                        else{
                            ay[index] = rs[i][key];
                        }
                    }
                }
                rows.cell = ay;
                rowsArray[i] = rows;
            }
            //将rows数组赋予jsonObj.rows
            jsonObj.rows = rowsArray;

            var jsonStr = JSON.stringify(jsonObj);
            console.log('jsonStr-dishes:'+jsonStr);
            return res.json(jsonObj, 200);

        });
    };
};
exports.confirm = function(req, res, next){
    var order_id=req.params.id;
    console.log(order_id);
    try {
        //说明是更新数据
        Order.update({id:order_id,status:2}, function(err,info){
            if(err) return next(err);

            //res.json({status:200, error:'更新商品信息成功!'}, 200);
            var jsonObj = {user:{id:info.insertId}};
            return res.json(jsonObj, 200);
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};
exports.cancel = function(req, res, next){
    var order_id=req.params.id;
    console.log(order_id);
    try {
        //说明是更新数据
        Order.update({id:order_id,status:0}, function(err,info){
            if(err) return next(err);

            //res.json({status:200, error:'更新商品信息成功!'}, 200);
            var jsonObj = {user:{id:info.insertId}};
            return res.json(jsonObj, 200);
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};
exports.sendd = function(req, res, next){
    var order_id=req.params.id;
    console.log(order_id);
    try {
        //说明是更新数据
        Order.update({id:order_id,status:3}, function(err,info){
            if(err) return next(err);

            //res.json({status:200, error:'更新商品信息成功!'}, 200);
            var jsonObj = {user:{id:info.insertId}};
            return res.json(jsonObj, 200);
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};
exports.success = function(req, res, next){
    var order_id=req.params.id;
    console.log(order_id);
    try {
        //说明是更新数据
        Order.update({id:order_id,status:4}, function(err,info){
            if(err) return next(err);

            //res.json({status:200, error:'更新商品信息成功!'}, 200);
            var jsonObj = {user:{id:info.insertId}};
            return res.json(jsonObj, 200);
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};
