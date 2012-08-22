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


Orders.prototype.findOne = function(opt, cb) {
    where = "";
    for(var k in opt) {
        var value = opt[k];
        if(typeof value != 'object' && typeof value != 'array') {
            where += " AND " + k + " = '" + value + "'";
        }
    }

    //var sql = "SELECT * FROM `user` WHERE `cellphone` LIKE '"+opt.loginname+"'";
    var sql = "SELECT * FROM `orders` WHERE 1=1 "+where;
    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        if(!rs.length) return cb(err);
//        console.log("rs: " + sys.inspect(rs[0]));
        cb(err, rs[0]);
    });
};

Orders.prototype.findAll = function(opt, cb) {
    var sql = " SELECT * FROM orders  "
        +" where 1=1 "+ opt.where;
    if(opt.sidx && opt.sord) sql += " ORDER BY "+opt.sidx+" "+opt.sord;
    if(opt.limit) sql += " LIMIT "+ opt.start + " , "+opt.limit;
    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        if(!rs.length) return cb(err);
        cb(err, rs);
    });
};

Orders.prototype.delete = function(id, cb) {
    var sql = " delete from orders where id=" + id;
    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        cb(err, rs);
    });
};
Orders.prototype.count = function(opt, cb) {
    var sql = "SELECT COUNT(*) AS count FROM dish where 1=1 "+opt.where;
    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        if(!rs.length) return cb(err);
        cb(err, rs[0]);
    });
};
Orders.prototype.update = function(body, cb) {
    var opt = {
        table: 'orders',
        fields: body
    };
    mysql.update(opt, function(err, info) {
        if(err) return next(err);
        return cb(err, info);
    });
};

exports = module.exports = createOrders;