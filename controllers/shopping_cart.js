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
        console.log("after add, shopping_cart: " + sys.inspect(req.session.shopping_cart));
        res.write('添加购物车成功');
        res.end();
    });

};

exports.del = function(req, res, next) {
    var dish_id = url.parse(req.url, true).query.id;
    for(var k in req.session.shopping_cart) {
        if(req.session.shopping_cart[k].dish.id == dish_id) {
            req.session.shopping_gross -= req.session.shopping_cart[k].sum;
            req.session.shopping_cart.splice(k, 1);
        }
    }
    console.log("after delete, shopping_cart: " + sys.inspect(req.session.shopping_cart));
    exports.show(req, res, next, '购物车修改成功');
};

exports.clear = function(req, res, next) {
    delete req.session.shopping_cart;
    delete req.session.shopping_gross;
    exports.show(req, res, next);
};

exports.show = function(req, res, next, err) {
    create_cart(req);
    if(req.session.shopping_cart.length == 0) err = '购物车是空的。'
    res.render('customer/shopping_cart', {error: err, deals: req.session.shopping_cart, gross: req.session.shopping_gross});
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