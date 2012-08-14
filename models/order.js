/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-6
 * Time: 下午5:57
 * To change this template use File | Settings | File Templates.
 */
var mysql = require('../dao/mysql.js');

var SimpleDO = require('../dao/simpleDO');

function createOrders() {
    return new Orders();
};

function Orders() {
};

Orders.prototype = new SimpleDO('`orders`');

Orders.prototype.create = function(body, cb) {
    var opt = {
        table: 'orders',
        fields: body
    };
    mysql.insert(opt, function(err, info) {
        if(err) return cb(err);
        return cb(err, info);
    });
};


exports = module.exports = createOrders;