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
    /*Dish.findAll({where:''}, function(err, result) {
        if(err) return next(err);
        res.render('index', {dishes: result});
        return;
    });*/
    res.render('index');

};

exports.homepage = function(req, res, next) {
    Restaurant.findAll({where: ''}, function(err, result) {
        if(err) return next(err);
        var rsLine = '';
        for(var k in result) {
            var restaurant = result[k];
            rsLine += '<div class="grid">' +
                '<div class="imgholder">' +
                '<a href="#"><img src="' + restaurant.image + '" /></a>' +
                '</div>' +
                '<strong>' + restaurant.name + '</strong>' +
                '<p>' + restaurant.intro + '</p>' +
                '<div class="meta">' +
                '   <p>地址：' + restaurant.address + '</p>' +
                '   <p>电话：' + restaurant.tel + '</p>' +
                '</div>' +
                '</div>';
        }
        res.write(rsLine);
        res.end();
        return;
    });
};

exports.dish_info = function(req, res, next) {
    var dish_id = url.parse(req.url, true).query.id;
    Dish.findOne({id: dish_id}, function(err, result) {
        if(err) return next(err);
        res.render('site/dish_info', {title: '菜品详情', dish: result});
    });
};

exports.headLine = function (req, res, next) {
    var headline = '<li id="logo_head" class="logo">' +
        '<img style="float:left;" alt="" src="/image/headline/menu_left.png"/>' +
        '<ul id="logo_sub">' +
            '<li>Welcome to <b>509 meal-ordering-system!</b></li>' +
            '<li class="last">' +
                '<img class="corner_left" alt="" src="/image/headline/corner_blue_left.png"/>' +
                '<img class="middle" alt="" src="/image/headline/dot_blue.png"/>' +
                '<img class="corner_right" alt="" src="/image/headline/corner_blue_right.png"/>' +
            '</li>' +
        '</ul>' +
        '</li>' +
        '<li id="home_page"><a id="homepage">首页</a></li>';
    if(req.session.user) {
        var user = req.session.user;
        var member = user.member;
        headline += '<li id="user_info">' + user.name + '</li>';
        //for(var k in user.member) {
            if(has(member, 1)) {
                headline += '<li id="credit">积分' +
                    '<ul id="credit_sub">' +
                        '<li>' +
                            '<img class="corner_inset_left" alt="" src="/image/headline/corner_inset_left.png"/>' +
                            '当前积分：98' +
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
            if(has(member, 0)) {
                headline += '<li><a href="/adm/change_customer_info">用户信息管理</a></li>';
                headline += '<li><a href="/adm/change_restaurant_info">店铺信息管理</a></li>';
            }
            if(has(member, 2)) {
                headline += '<li id="resadm">餐馆管理</li>';
            }
        //}
        headline += '<li><a href="/signout">退出</a></li>';
    }else {
        headline += '<li><a href="/signin/">登录</a></li>' + '<li><a href="/signup/">注册</a></li>';
    }

    function has(member, role) {
        for(var k in member) {
            var value = member[k];
            if(value.role == role) return true;
        }
        return false;
    }

    res.write(headline);
    res.end();
};
