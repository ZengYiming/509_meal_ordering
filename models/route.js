/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-22
 * Time: 下午2:23
 * To change this template use File | Settings | File Templates.
 */

var mysql = require('../dao/mysql.js');

var SimpleDO = require('../dao/simpleDO');

function createRoute() {
    return new Route();
};

function Route() {
};
Route.prototype = new SimpleDO('`route`');

Route.prototype.findOne = function(opt, cb) {

    where = "";
    for(var k in opt) {
        var value = opt[k];
        if(typeof value != 'object' && typeof value != 'array') {
            where += " AND " + k + " = '" + value + "'";
        }
    }

    var sql = "SELECT * FROM `route` WHERE 1=1 "+where;
    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        if(!rs.length) return cb(err);
//        console.log("rs: " + sys.inspect(rs[0]));
        cb(err, rs[0]);
    });
};

exports = module.exports = createRoute;