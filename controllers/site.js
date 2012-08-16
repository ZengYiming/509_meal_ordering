/*var tag_ctrl = require('./tag');
var user_ctrl = require('./user');
var topic_ctrl = require('./topic');
var config = require('../config').config;
var EventProxy = require('eventproxy').EventProxy;

var sanitize = require('validator').sanitize;
*/
//var Log = require('../log.js');
//var log = Log.create(Log.INFO, {'file':'public/node.debug'});
//var MQClient = require('../libs/mq_client.js');

var models = require('../models');
var Restaurant = models.Restaurant;
var Dish = models.Dish;

//var url = require('url');

exports.index = function(req, res, next){
    Dish.findAll({where:''}, function(err, result) {
        if(err) return next(err);
        res.render('index', {dishes: result});
        return;
    });

    /*Restaurant.findAll({}, function(err, result) {
        if(err) return next(err);
        res.render('index', {restaurants: result});
        return;
    });*/

};

exports.dish_info = function(req, res, next) {
    var dish_id = url.parse(req.url, true).query.id;
    Dish.findOne({id: dish_id}, function(err, result) {
        if(err) return next(err);
        res.render('site/dish_info', {title: '菜品详情', dish: result});
    });
};

exports.headLine = function (req, res, next) {
    var headline = '<th><a href="http://localhost:8888/">首页</a></th>';
    if(req.session.user) {
        var user = req.session.user;
        headline += '<th><a href="http://localhost:8888/user/index">' + user.name + '</a></th>';
        for(var k in user.member) {
            if(user.member[k].role == 1) {
                headline += '<th>积分：' + user.member[k].credits + '</th>';
                headline += '<th><a href="http://localhost:8888/customer/shopping_cart">我的购物车</a></th>';
                headline += '<th><a href="http://localhost:8888/customer/order_list">我的订单</a></th>';
            }
            else if(user.member[k].role == 0) {
                headline += '<th><a href="http://localhost:8888/adm/change_customer_info">用户信息管理</a></th>';
                headline += '<th><a href="http://localhost:8888/adm/change_restaurant_info">店铺信息管理</a></th>';
            }
            else if(user.member[k].role == 2) {
                headline += '<th><a href="#">餐馆管理</a></th>';
            }
        }
        headline += '<th><a href="http://localhost:8888/signout">退出</a></th>';
    }else {
        headline += '<th><a href="http://localhost:8888/signin/">登录</a></th>' + '<th><a href="http://localhost:8888/signup/">注册</a></th>';
    }

    res.write(headline);
    res.end();
};
