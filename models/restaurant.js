/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-6
 * Time: 下午5:57
 * To change this template use File | Settings | File Templates.
 */
var mysql = require('../dao/mysql.js');

var SimpleDO = require('../dao/simpleDO');

function createRestaurant() {
    return new Restaurant();
};

function Restaurant() {
};

Restaurant.prototype = new SimpleDO('`restaurant`');

Restaurant.prototype.findAll = function(opt, cb) {
    var sql = " SELECT * FROM restaurant  "
        +" where 1=1 ";
    if(opt.sidx && opt.sord) sql += " ORDER BY "+opt.sidx+" "+opt.sord;
    if(opt.limit) sql += " LIMIT "+ opt.start + " , "+opt.limit;
    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        if(!rs.length) return cb(err);
        cb(err, rs);
    });
}

exports = module.exports = createRestaurant;