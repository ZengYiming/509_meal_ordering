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

var EventProxy = require('eventproxy').EventProxy;
var sanitize = require('validator').sanitize;

exports.add = function (req, res, next) {
    function feedback(err, opt) {
        if(opt) {
            res.render('customer/shopping_cart', {error: err, deals: req.session.shopping_cart, gross: req.session.shopping_gross, rec_name: opt.rec_name, rec_tel: opt.rec_tel, rec_addr: opt.rec_addr});
        }else {
            res.render('customer/shopping_cart', {error: err, deals: req.session.shopping_cart, gross: req.session.shopping_gross});
        }

        return;
    }
    var method = req.method.toLowerCase();
    if(method == 'get') {
        if(req.session.shopping_cart.length == 0) err = '购物车是空的。'
        feedback(err);
    }
    if(method == 'post') {
        var ep = EventProxy.create();
        ep.on('order', function(order_id) {
            create_order_dish(order_id);
        });
        ep.on('done', function() {
            //跳转到订单列表页面
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
        var body = {user_id: user.id, submit_time: date, status: 1, rec_name: rec_name, rec_tel: rec_tel, rec_addr: rec_addr};

        Order.create(body, function(err, info) {
            if(err) return next(err);
            if(info) {
                ep.trigger('order', info.insertId);
            }
        });

        function create_order_dish(order_id) {
            Order_dish.create(body, function(err, info) {
                if(err) return next(err);
                if(info) {
                    ep.trigger('done');
                }
            });
        }
    }
};