/**
 * Created with JetBrains WebStorm.
 * User: baiweiya
 * Date: 12-8-20
 * Time: 上午9:57
 * To change this template use File | Settings | File Templates.
 */
var models = require('../models');
var User = models.User;
var Restaurant = models.Restaurant;
var Dish= models.Dish;
var EventProxy = require('eventproxy').EventProxy;

var check = require('validator').check;
var sanitize = require('validator').sanitize;
var config = require('../config').config;
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var sys = require('sys');

exports.change_dish_info = function(req, res, next){
    var res_id = req.params.id;
    console.log(res_id);
    Restaurant.findOne({id:res_id},function(err,rs){
        if(err) next(err);
        //console.log(rs);
        res.render('res_adm/change_dish_info',{title:'菜品信息管理',res_id:rs.id,res_name:rs.name});
    });
};
exports.findalldish = function(req, res, next){
    var page = req.query.page;//起始行数 for jqgrid
    var start = req.query.start;//起始行数
    var limit = req.query.limit;//每页显示行数
    var bt = req.query.bt;//交易发生时间起点
    var et = req.query.et;//交易发生截至时间
    var sidx = req.query.sidx;//排序字段名
    var sord = req.query.sord;//排序方式
    var type_id = req.query.type_id;//商品类型ID
    var ep = EventProxy.create();

    var res_id = req.params.res_id;
    //根据前台页面传入的查询条件，开始拼接where语句
    var where = ' and restaurant_id='+res_id;

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

    Dish.count({where:where, bt:bt, et:et}, function(err, count) {
        if(err) { ep.unbind(); return next(err);}
        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});
        ep.trigger('findAllForWeb', where, count.count);
    });

    function findAllForWeb(where, count) {
        var showElement = ['id', 'name', 'price', 'intro', 'image'];

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

        Dish.findAll({where:where, start:start, limit:limit, sidx:sidx, sord:sord, bt:bt, et:et}, function(err, rs) {
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
            console.log('jsonStr-dishes:'+jsonStr);
            return res.json(jsonObj, 200);

        });
    };
};
exports.addpageDish = function(req, res, next){
    console.log("新建菜品。。。");
    try {
        var img = 'default_dish.gif';
        var dish_src = '/image/dish/' + img;
        //check(id, "流水号不能为空！").notNull();
        res.render('res_adm/add_dish_info', { layout: false, dish_src: dish_src});
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};
exports.addDish = function(req, res, next){
    console.log("save new dish。。。");
    //开始校验输入数值的正确性
    var name = req.body.name;
    var price = req.body.price;
    var intro = req.body.intro;
    //var image = req.body.image;

    try {
        check(name, "保存失败，名称不能为空！").notNull();
        check(price, "保存失败，价格不能为空！").notNull();
        check(intro, "保存失败，简要介绍不能为空！").notNull();

        //创建时间
        Dish.create({name:name, price:price, intro:intro}, function(err,info){
            if(err) return next(err);

            //res.json({status:200, error:'更新商品信息成功!'}, 200);
            var jsonObj = {dish:{id:info.insertId}};
            return res.json(jsonObj, 200);
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};