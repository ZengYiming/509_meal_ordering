/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-22
 * Time: 下午2:22
 * To change this template use File | Settings | File Templates.
 */

var mysql = require('../dao/mysql.js');

var SimpleDO = require('../dao/simpleDO');

function createRole_route() {
    return new Role_route();
};

function Role_route() {
};
Role_route.prototype = new SimpleDO('`role_route`');

/**
 * 查询所有的数据
 * @param opt 参数，包含：opt.where， opt.sidx， opt.sord， opt.start ， opt.limit;
 * @param cb 回调
 */
Role_route.prototype.findAll = function(opt, cb) {
    var sql = " SELECT * FROM role_route  "
        +" where 1=1 "+ opt.where;
    if(opt.sidx && opt.sord) sql += " ORDER BY "+opt.sidx+" "+opt.sord;
    if(opt.limit) sql += " LIMIT "+ opt.start + " , "+opt.limit;
    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        if(!rs.length) return cb(err);
        cb(err, rs);
    });
};

exports = module.exports = createRole_route;