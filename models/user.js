/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-6
 * Time: 下午4:53
 * To change this template use File | Settings | File Templates.
 */
var sys = require("sys");

var mysql = require('../dao/mysql.js');

var SimpleDO = require('../dao/simpleDO');

function createUser() {
    return new User();
};

function User() {
};
User.prototype = new SimpleDO('`user`');

User.prototype.findOne = function(opt, cb) {

    where = "";
    for(var k in opt) {
        var value = opt[k];
        if(typeof value != 'object' && typeof value != 'array') {
           /* if(k && k == "loginname") k = "cellphone";
            //where += " AND " + k + " LIKE  '" + value + "'";
            if( typeof value == 'number') {*/
                where += " AND " + k + " = '" + value + "'";
          /*  }
            else {
                where += " AND " + k + " LIKE  '" + value + "'";
            }*/
        }
    }

    //var sql = "SELECT * FROM `ef_user` WHERE `cellphone` LIKE '"+opt.loginname+"'";
    var sql = "SELECT * FROM `user` WHERE 1=1 "+where;
    mysql.query(sql, function(err, rs) {
        if(err) return cb(err);
        if(!rs.length) return cb(err);
//        console.log("rs: " + sys.inspect(rs[0]));
        cb(err, rs[0]);
    });
};

/**
 * 查询所有的数据
 * @param opt 参数，包含：opt.where， opt.sidx， opt.sord， opt.start ， opt.limit;
 * @param cb 回调
 */
User.prototype.findAll = function(opt, cb) {
    var sql = " SELECT * FROM ef_user  "
        +" where 1=1 "+ opt.where;
    if(opt.sidx && opt.sord) sql += " ORDER BY "+opt.sidx+" "+opt.sord;
    if(opt.limit) sql += " LIMIT "+ opt.start + " , "+opt.limit;
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
User.prototype.count = function(opt, cb) {
    var sql = "SELECT COUNT(*) AS count FROM ef_user where 1=1 "+opt.where;
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
User.prototype.create = function(body, cb) {
    var opt = {
        table: 'ef_user',
        fields: body
    };
    mysql.insert(opt, function(err, info) {
        if(err) return cb(err);
        return cb(err, info);
    });
};

/**
 * 删除一批数据
 * @param ids 序号，可以为多个以','号分隔，例如：01,02,03
 * @param cb 回调
 */
User.prototype.delete = function(ids, cb) {
    var sql = " delete from ef_user where _id in(" + ids + ") ";
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
User.prototype.update = function(body, cb) {
    var opt = {
        table: 'ef_user',
        fields: body
    };
    mysql.update(opt, function(err, info) {
        if(err) return next(err);
        return cb(err, info);
    });
};

exports = module.exports = createUser;

/*var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var UserSchema = new Schema({
 name: { type: String, index: true },
 loginname: { type: String },
 pass: { type: String },
 email: { type: String },
 url: { type: String },
 location: { type: String },
 signature: { type: String },
 profile: { type: String },
 weibo: { type: String },
 avatar: { type: String },

 score: { type: Number, default: 0 },
 topic_count: { type: Number, default: 0 },
 reply_count: { type: Number, default: 0 },
 follower_count: { type: Number, default: 0 },
 following_count: { type: Number, default: 0 },
 collect_tag_count: { type: Number, default: 0 },
 collect_topic_count: { type: Number, default: 0 },
 create_at: { type: Date, default: Date.now },
 update_at: { type: Date, default: Date.now },
 is_star: { type: Boolean },
 level: { type: String },
 active: { type: Boolean, default: true },

 receive_reply_mail: {type: Boolean, default: false },
 receive_at_mail: { type: Boolean, default: false },
 from_wp: { type: Boolean },

 retrieve_time : {type: Number},
 retrieve_key : {type: String}
 });

 mongoose.model('User', UserSchema);
 */