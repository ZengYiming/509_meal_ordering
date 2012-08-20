/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-13
 * Time: 下午5:20
 * To change this template use File | Settings | File Templates.
 */
var models = require('../models');
var Dish = models.Dish;

var sys = require('sys');
var url = require('url');

exports.add = function(req, res, next) {
    Dish.findOne({id: req.body.id}, function(err, result) {
        if(err) return next(err);
        var sum = result.price * req.body.quantity;
        var deal = {dish: result, quantity: req.body.quantity, sum: sum};
        create_cart(req);
        req.session.shopping_gross += sum;
        merge(req, deal);
//        console.log("after add, shopping_cart: " + sys.inspect(req.session.shopping_cart));
        res.write('添加购物车成功');
        res.end();
    });

};

exports.del = function(req, res, next) {
    var dish_id = url.parse(req.url, true).query.id;
    console.log("in shopping_cart del, dish_id = " + dish_id);
    for(var k in req.session.shopping_cart) {
        if(req.session.shopping_cart[k].dish.id == dish_id) {
            req.session.shopping_gross -= req.session.shopping_cart[k].sum;
            req.session.shopping_cart.splice(k, 1);
        }
    }
//    console.log("after delete, shopping_cart: " + sys.inspect(req.session.shopping_cart));
 //   exports.show(req, res, next, '购物车修改成功');
    res.write('');
    res.end();
    return;
};

exports.clear = function(req, res, next) {
    delete req.session.shopping_cart;
    delete req.session.shopping_gross;
//    exports.show(req, res, next);
    res.write('');
    res.end();
};

/*exports.show = function(req, res, next, err) {
    create_cart(req);
    if(req.session.shopping_cart.length == 0) err = '购物车是空的。'
    res.render('customer/shopping_cart', {error: err, deals: req.session.shopping_cart, gross: req.session.shopping_gross});
};*/

exports.show = function(req, res, next, err) {
//    console.log('in shopping_cart, show.');
    create_cart(req);
    var content = '我的购物车';
    if(req.session.shopping_cart.length == 0) {
        content += '<ul id="shopping_cart_sub">' +
            '<li>' +
            '<img class="corner_inset_left" alt="" src="/image/headline/corner_inset_left.png"/>' +
            '<p>购物车为空</p>' +
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
    content += '<ul id="shopping_cart_sub">' +
        '<li>' +
        '<img class="corner_inset_left" alt="" src="/image/headline/corner_inset_left.png"/>' +
        '总金额：' + req.session.shopping_gross  +
        '<img class="corner_inset_right" alt="" src="/image/headline/corner_inset_right.png"/>'+
        '</li>' +
        '<li><table id="sc_table"><tr><th>菜名</th><th>单价</th><th>数量</th><th>金额</th><th></th></tr>';
    for(var k in req.session.shopping_cart) {
        var value = req.session.shopping_cart[k];
//        console.log('in shopping_cart, value: ' + sys.inspect(value));
        content += '<tr id="sc_row"><td>' + value.dish.name + '</td><td>' + value.dish.price + '</td><td>' + value.quantity + '</td><td>' + value.sum + '</td>' +
            '<td><a id="shopping_cart_del" name="'+ value.dish.id + '">删除</a></td></tr>';
    }
    content += '</table></li>' +
        '<li>' +
        '<a id="shopping_cart_clear">清空购物车</a>' +
        '<a id="shopping_cart_buy">确认购买</a>' +
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
};

function create_cart(req) {
    if(!req.session.shopping_cart) {
        req.session.shopping_cart = [];
    }
    if(!req.session.shopping_gross) {
        req.session.shopping_gross = 0;
    }
    return;
};

function merge(req, deal) {
    for(var k in req.session.shopping_cart) {
        if(req.session.shopping_cart[k].dish.id == deal.dish.id) {
            req.session.shopping_cart[k].quantity =  parseInt(req.session.shopping_cart[k].quantity) + parseInt(deal.quantity);
            req.session.shopping_cart[k].sum += deal.sum;
            return;
        }
    }
    req.session.shopping_cart.push(deal);
    return;
};