/**
 * Created with JetBrains WebStorm.
 * User: Viya Bai
 * Date: 12-8-11
 * Time: 下午1:44
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-10
 * Time: 下午4:08
 * To change this template use File | Settings | File Templates.
 */
var models = require('../models');
var User = models.User;
var Restaurant = models.Restaurant;
var EventProxy = require('eventproxy').EventProxy;

var check = require('validator').check;
var sanitize = require('validator').sanitize;
var config = require('../config').config;

exports.adm_control_panel = function(req, res, next){
    res.render('adm/adm_control_panel',{title: '系统管理员控制面板'});
};
exports.change_customer_info = function(req, res, next){
    res.render('adm/change_customer_info',{title:'用户信息'});

};
exports.change_customer_info_success = function(req, res, next){
    res.send('更改用户信息成功！');
};

exports.findallusers = function(req, res, next){
    var page = req.query.page;//起始行数 for jqgrid
    var start = req.query.start;//起始行数
    var limit = req.query.limit;//每页显示行数
    var bt = req.query.bt;//交易发生时间起点
    var et = req.query.et;//交易发生截至时间
    var sidx = req.query.sidx;//排序字段名
    var sord = req.query.sord;//排序方式
    var type_id = req.query.type_id;//商品类型ID
    var ep = EventProxy.create();

    //根据前台页面传入的查询条件，开始拼接where语句
    var where = ' ';

    function feedback(result) {
        if(200 == result.status) {
            if(result.jsonObj) {
//                var jsonStr = JSON.stringify(result.jsonObj);
//                console.log('jsonStr:'+jsonStr);
                return res.json(result.jsonObj, result.status);
            }else{
                ep.trigger('error', {status:204, error:'查询结果为空!'});
            }
        }
        else {
            return res.json(result, result.status);
        }
    };

    //当有异常发生时触发
    ep.once('error', function(result) {
        ep.unbind();//remove all event
        return feedback(result);
    });
    ep.on('findAllForWeb', function(where, count) {
        findAllForWeb(where, count);
    });

    User.count({where:where, bt:bt, et:et}, function(err, count) {
        if(err) { ep.unbind(); return next(err);}
        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});
        ep.trigger('findAllForWeb', where, count.count);
    });

    function findAllForWeb(where, count) {
        var showElement = ['id', 'username', 'password', 'name', 'tel', 'email', 'image'];

        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});

        if(!sidx){
            sidx = 1;
        }

        // 查询结果总页数
        var total_pages = 0;

        // 计算查询结果页数
        if(count > 0 && limit > 0){
            total_pages = Math.ceil(count/limit);
        }

        // 若请求页大于总页数，设置请求页为最后一页
        if (page > total_pages) page = total_pages;

        // 计算起始行
        var start = limit * page - limit;
        // 若起始行为0
        if(start < 0) start = 0;

        User.findAll({where:where, start:start, limit:limit, sidx:sidx, sord:sord, bt:bt, et:et}, function(err, rs) {
            if(err) { ep.unbind(); return next(err);}
            if (!rs || rs == undefined) return ep.trigger('error', {status:204, error:'查询结果为空！'});
        //开始汇总
            var jsonObj = new Object();

            jsonObj.page = page;  // 当前页
            jsonObj.total = total_pages;    // 总页数
            jsonObj.records = count;  // 总记录数

            //定义rows 数组，保存所有rows数据
            var rowsArray = new Array();
            for(var i=0; i<rs.length; i++){
                // 定义rows
                var rows = new Object();
                rows.id = rs[i]._id;
                //rows.cell = rs[i];
                var ay = new Array();
                for(key in rs[i]){
                    var index = showElement.indexOf(key);
                    if(index >= 0){
                        ay[index] = rs[i][key];
                    }
                }
                rows.cell = ay;
                rowsArray[i] = rows;
            }
            //将rows数组赋予jsonObj.rows
            jsonObj.rows = rowsArray;

            var jsonStr = JSON.stringify(jsonObj);
            console.log('jsonStr-users:'+jsonStr);
            return res.json(jsonObj, 200);

        });
    };

};

exports.change_restaurant_info = function(req, res, next){
    res.render('adm/change_restaurant_info',{title:'店铺信息'});

};
exports.change_restaurant_info_success = function(req, res, next){
    res.send('更改用户信息成功！');
};

exports.findallrestaurants = function(req, res, next){
    var page = req.query.page;//起始行数 for jqgrid
    var start = req.query.start;//起始行数
    var limit = req.query.limit;//每页显示行数
    var bt = req.query.bt;//交易发生时间起点
    var et = req.query.et;//交易发生截至时间
    var sidx = req.query.sidx;//排序字段名
    var sord = req.query.sord;//排序方式
    var type_id = req.query.type_id;//商品类型ID
    var ep = EventProxy.create();

    //根据前台页面传入的查询条件，开始拼接where语句
    var where = ' ';

    function feedback(result) {
        if(200 == result.status) {
            if(result.jsonObj) {
//                var jsonStr = JSON.stringify(result.jsonObj);
//                console.log('jsonStr:'+jsonStr);
                return res.json(result.jsonObj, result.status);
            }else{
                ep.trigger('error', {status:204, error:'查询结果为空!'});
            }
        }
        else {
            return res.json(result, result.status);
        }
    };

    //当有异常发生时触发
    ep.once('error', function(result) {
        ep.unbind();//remove all event
        return feedback(result);
    });
    ep.on('findAllForWeb', function(where, count) {
        findAllForWeb(where, count);
    });

    Restaurant.count({where:where, bt:bt, et:et}, function(err, count) {
        if(err) { ep.unbind(); return next(err);}
        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});
        ep.trigger('findAllForWeb', where, count.count);
    });

    function findAllForWeb(where, count) {
        var showElement = ['id', 'name', 'tel', 'address', 'intro', 'image'];

        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});

        if(!sidx){
            sidx = 1;
        }

        // 查询结果总页数
        var total_pages = 0;

        // 计算查询结果页数
        if(count > 0 && limit > 0){
            total_pages = Math.ceil(count/limit);
        }

        // 若请求页大于总页数，设置请求页为最后一页
        if (page > total_pages) page = total_pages;

        // 计算起始行
        var start = limit * page - limit;
        // 若起始行为0
        if(start < 0) start = 0;

        Restaurant.findAll({where:where, start:start, limit:limit, sidx:sidx, sord:sord, bt:bt, et:et}, function(err, rs) {
            if(err) { ep.unbind(); return next(err);}
            if (!rs || rs == undefined) return ep.trigger('error', {status:204, error:'查询结果为空！'});
            //开始汇总
            var jsonObj = new Object();

            jsonObj.page = page;  // 当前页
            jsonObj.total = total_pages;    // 总页数
            jsonObj.records = count;  // 总记录数

            //定义rows 数组，保存所有rows数据
            var rowsArray = new Array();
            for(var i=0; i<rs.length; i++){
                // 定义rows
                var rows = new Object();
                rows.id = rs[i]._id;
                //rows.cell = rs[i];
                var ay = new Array();
                for(key in rs[i]){
                    var index = showElement.indexOf(key);
                    if(index >= 0){
                        ay[index] = rs[i][key];
                    }
                }
                rows.cell = ay;
                rowsArray[i] = rows;
            }
            //将rows数组赋予jsonObj.rows
            jsonObj.rows = rowsArray;

            var jsonStr = JSON.stringify(jsonObj);
            console.log('jsonStr-restaurants:'+jsonStr);
            return res.json(jsonObj, 200);

        });
    };
};