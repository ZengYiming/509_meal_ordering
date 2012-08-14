/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-6
 * Time: 下午5:58
 * To change this template use File | Settings | File Templates.
 */
var mysql = require('../dao/mysql.js');

var SimpleDO = require('../dao/simpleDO');

function createOrder_dish() {
    return new Order_dish();
};

function Order_dish() {
};

Order_dish.prototype = new SimpleDO('`order_dish`');

Order_dish.prototype.create = function(body, cb) {
    var opt = {
        table: 'order_dish',
        fields: body
    };
    mysql.insert(opt, function(err, info) {
        if(err) return cb(err);
        return cb(err, info);
    });
}

exports = module.exports = createOrder_dish;