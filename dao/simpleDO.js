var mysql = require('./mysql.js');

function SimpleDO(schema) {
    this.schema = schema||'';
};

/**
    查询一个数据对象
    querys：查询条件以对象形式出现，例如：{_id:123}
    cb：回调函数，在查询完成后异步执行返回结果。
*/
SimpleDO.prototype.findOne = function(query, cb) {
    var argLen = arguments.length;
    if(argLen < 1) return;
    var callback = arguments[argLen-1];
    arguments[argLen-1] = function(err, rs, fields) {
        if(err || !rs.length) callback(err);
        else callback(err, rs[0], fields);
    };
    this.find.apply(this, Array.prototype.slice.call(arguments));
};

/**
    查询一批数据对象
    querys：查询条件以对象形式出现，例如：{_id:123, field: { $lt: value }}
    cb：回调函数，在查询完成后异步执行返回结果。
*/
SimpleDO.prototype.find = function(query, cb) {
    var argLen = arguments.length;
    if(argLen < 1) return;
    var callback = arguments[argLen-1];
    var options = {schema:this.schema};
    if(argLen > 1) options.query = arguments[0];
    if(argLen > 2) options.field = arguments[1];
    mysql.find(options, callback);    
};

exports = module.exports = SimpleDO;