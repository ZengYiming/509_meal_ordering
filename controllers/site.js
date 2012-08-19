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

var url = require('url');

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
    var headline = '<li id="logo" class="logo">' +
        '<img style="float:left;" alt="" src="/image/headline/menu_left.png"/>' +
        '<ul id="main">' +
            '<li>Welcome to <b>509</b> tutorial!</li>' +
            '<li class="last">' +
                '<img class="corner_left" alt="" src="/image/headline/corner_blue_left.png"/>' +
                '<img class="middle" alt="" src="/image/headline/dot_blue.png"/>' +
                '<img class="corner_right" alt="" src="/image/headline/corner_blue_right.png"/>' +
            '</li>' +
        '</ul>' +
        '</li>' +
        '<li id="home_page"><a href="http://localhost:8888/">首页</a></li>';
    if(req.session.user) {
        var user = req.session.user;
        headline += '<li id="user_info">' + user.name + '</li>';
        for(var k in user.member) {
            if(user.member[k].role == 1) {
                headline += '<li id="credit">积分' +
                    '<ul id="credit_sub">' +
                        '<li>' +
                            '<img class="corner_inset_left" alt="" src="/image/headline/corner_inset_left.png"/>' +
                            '当前积分：'  +  user.member[k].credits +
                            '<img class="corner_inset_right" alt="" src="/image/headline/corner_inset_right.png"/>'+
                        '</li>' +
                        '<li class="last">' +
                            '<img class="corner_left" alt="" src="/image/headline/corner_left.png"/>' +
                            '<img class="middle" alt="" src="/image/headline/dot.gif"/>' +
                            '<img class="corner_right" alt="" src="/image/headline/corner_right.png"/>' +
                        '</li>' +
                    '</ul>'+
                    '</li>';
                headline += '<li id="shopping_cart">我的购物车</li>';
                headline += '<li id="orders">我的订单</li>';
            }
            else if(user.member[k].role == 0) {
                headline += '<li><a href="http://localhost:8888/adm/change_customer_info">用户信息管理</a></li>';
                headline += '<li><a href="http://localhost:8888/adm/change_restaurant_info">店铺信息管理</a></li>';
            }
            else if(user.member[k].role == 2) {
                headline += '<li><a href="#">餐馆管理</a></li>';
            }
        }
        headline += '<li><a href="http://localhost:8888/signout">退出</a></li>';
    }else {
        headline += '<li><a href="http://localhost:8888/signin/">登录</a></li>' + '<li><a href="http://localhost:8888/signup/">注册</a></li>';
    }

    res.write(headline);
    res.end();
};
