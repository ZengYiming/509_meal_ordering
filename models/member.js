/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-6
 * Time: 下午5:56
 * To change this template use File | Settings | File Templates.
 */
var mysql = require('../dao/mysql.js');
var SimpleDO = require('../dao/simpleDO');

function create() {
    return new Member();
};

function Member() {
    this.table = 'member';
};
Member.prototype = new SimpleDO('member');

Member.prototype.findOne_bak = function(opt, cb) {
    /*
     var sql = 'SELECT * FROM member WHERE org_id = '+opt.org+' AND user_id = '+opt.user;
     mysql.query(sql, function(err, rs) {
     if(err) return cb(err);
     if(!rs.length) return cb(err);
     cb(err, rs[0]);
     });*/

    /** for view
     where条件查询具有普遍意义可以封装到mysql.js中，被其他model复用。
     */
    where = "";
    for(var k in opt) {
        var value = opt[k];
        if(typeof value != 'object' && typeof value != 'array') {
            if( typeof value == 'number') {
                where += " AND " + k + " = " + value;
            }
            else {
                where += " AND " + k + " LIKE  '" + value + "'";
            }
        }
    }

    var sql = "SELECT * FROM `member` WHERE 1=1"+where;
    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        if(!rs.length) return cb(err);
        cb(err, rs[0]);
    });



};

/**
 * 查询所有的数据
 * @param opt 参数，包含：opt.where， opt.sidx， opt.sord， opt.start ， opt.limit;
 * @param cb 回调
 */
Member.prototype.findAll = function(opt, cb) {
    var sql = " SELECT * FROM member "
        +" where 1=1 "+ opt.where;
    if(opt.bt) sql += " and create_time >= "+ opt.bt;
    if(opt.et) sql += " and create_time <= "+ opt.et;
    if(opt.sidx && opt.sord) sql += " ORDER BY "+opt.sidx+" "+opt.sord;
    if(opt.limit && opt.start) sql += " LIMIT "+ opt.start + " , "+opt.limit;

    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        if(!rs.length) return cb(err);
        cb(err, rs);
    });
};

/**
 * 根据条件获得数据的行数
 * @param where 页面传入的查询条件
 * @param cb 回调
 */
Member.prototype.count = function(opt, cb) {
    var sql = "SELECT COUNT(*) AS count FROM member where 1=1 "+opt.where;
    if(opt.bt) sql += " and create_time >= "+ opt.bt;
    if(opt.et) sql += " and create_time <= "+ opt.et;

    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        if(!rs.length) return cb(err);
        cb(err, rs[0]);
    });
};

/**
 * 创建
 * @param body 前台传入的页面提交数据对象
 * @param cb 回调
 */
Member.prototype.create = function(body, cb) {
    var opt = {
        table: 'member',
        fields: body
    };
    mysql.insert(opt, function(err, info) {
        if(err) return next(err);
        return cb(err, info);
    });
};

/**
 * 删除一批数据
 * @param ids 员工的序号，可以为多个以','号分隔，例如：01,02,03
 * @param cb 回调
 */
Member.prototype.delete = function(ids, cb) {
    var sql = " delete from member where _id in(" + ids + ") ";
    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        cb(err, rs);
    });
};

/**
 * 更新
 * @param body 前台传入的页面提交数据对象
 * @param cb 回调
 */
Member.prototype.update = function(body, cb) {
    var opt = {
        table: 'member',
        fields: body
    };
    mysql.update(opt, function(err, info) {
        if(err) return next(err);
        return cb(err, info);
    });
};

exports = module.exports = create;