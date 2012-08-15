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

var url = require('url');
var EventProxy = require('eventproxy').EventProxy;
var sanitize = require('validator').sanitize;
var sys = require('sys');

exports.show_info = function(req, res, next) {
    var order_id = url.parse(req.url, true).query.order_id;
    var ep = EventProxy.create();
    ep.assign('findOrder', 'findDishes', function(order, dishes) {
        res.render('customer/order_info', {order: order, dishes: dishes});
        //console.log("in order show_info, dishes: " + sys.inspect(dishes));
    });

    Order.findOne({id: order_id}, function(err, result) {
        if(err) return next(err);
        ep.trigger('findOrder', result);
    });
    Order_dish.findAll({where: 'AND order_id=' + order_id}, function(err, result) {
        if(err) return next(err);
        var dishes = [];
        ep.after('getDish', result.length, function(dish) {
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
                    dish.restaurant_name = rest.name;
                    dish.quantity = value.quantity;
                    //console.log("in order show_info, dish: " + sys.inspect(dish));
                    dishes.push(dish);
                    ep.trigger('getDish', dish);
                });
            });
        }
    });
};

exports.show_list = function(req, res, next, error) {
    var user = req.session.user;
    Order.findAll({where: 'AND user_id=' + user.id}, function(err, orders) {
        if(err) return next(err);
        /*for(var k in orders) {
            var order = orders[k];
            switch(order.status){
                case 0:
                    order.status = '无法完成';
                    break;
                case 1:
                    order.status = '订单已提交';
                    break;
                case 2:
                    order.status = '制作中';
                    break;
                case 3:
                    order.status = '派送中';
                    break;
                case 4:
                    order.status = '完成交易'
                    break;
            }
        }
*/
        res.render('customer/order_list', {error: error, orders: orders});
    });

};

exports.add = function(req, res, next) {
    function feedback(err, opt) {
        if(opt) {
            res.render('customer/order_add', {error: err, deals: req.session.shopping_cart, gross: req.session.shopping_gross, rec_name: opt.rec_name, rec_tel: opt.rec_tel, rec_addr: opt.rec_addr});
        }else {
            res.render('customer/order_add', {error: err, deals: req.session.shopping_cart, gross: req.session.shopping_gross});
        }

        return;
    }
    var method = req.method.toLowerCase();
    if(method == 'get') {
        if(req.session.shopping_cart.length == 0) {
            var err = '购物车是空的。'
            feedback(err);
        }
        feedback();
    }
    if(method == 'post') {
        var ep = EventProxy.create();
        ep.on('order', function(order_id) {
            create_order_dish(order_id);
        });
        ep.on('order_dish', function() {
            clear_shopping_cart();
        });
        ep.on('done', function() {
            //跳转到订单列表页面
            exports.show_list(req, res, next, '订单提交成功');
        });


        var rec_name = sanitize(req.body.rec_name).trim();
        var rec_tel = sanitize(req.body.rec_tel).trim();
        var rec_addr = sanitize(req.body.rec_addr).trim();

        if(rec_name == '' || rec_tel == '' || rec_addr == '') {
            feedback('信息不完整', {rec_name: rec_name, rec_tel:rec_tel, rec_addr: rec_addr});
            return;
        }
        var user = req.session.user;
        var date = new Date();
        var dateTime = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        console.log("in order.js, dateTime: " + dateTime);
        var order_body = {user_id: user.id, submit_time: dateTime, status: 1, rec_name: rec_name, rec_tel: rec_tel, rec_addr: rec_addr};


        Order.create(order_body, function(err, info) {
            if(err) return next(err);
            if(info) {
                ep.trigger('order', info.insertId);
            }
        });

        function create_order_dish(order_id) {
            ep.after('create_od', req.session.shopping_cart.length, function() {
                ep.trigger('order_dish');
            });
            for(var k in req.session.shopping_cart) {
                var value = req.session.shopping_cart[k];
                var od_body = {order_id: order_id, dish_id: value.dish.id, quantity: value.quantity};
                console.log("in order.js create_order_dish, od_body: " + sys.inspect(od_body));
                Order_dish.create(od_body, function(err, info) {
                    if(err) return next(err);
                    ep.trigger('create_od');
                });
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
    var order_id = url.parse(req.url, true).query.order_id;
    Order.delete(order_id, function(err, rs) {
        if(err) return next(err);
        exports.show_list(req, res, next, '订单删除成功');
    });
};