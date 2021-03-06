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
var Member = models.Member;
var EventProxy = require('eventproxy').EventProxy;

var check = require('validator').check;
var sanitize = require('validator').sanitize;
var config = require('../config').config;
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var sys = require('sys');

exports.change_customer_info = function(req, res, next){
    res.render('adm/change_customer_info',{title:'用户信息管理'});

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
                rows.id = rs[i].id;
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

exports.userpageEdit = function(req, res, next) {
    var id = req.params.id;
    console.log("开始 userpageEdit 。。。id="+id);
    // 本页面有3个状态： 新增， 查看， 编辑
    // - 新增(pageState=0)： 所有输入框为空，显示：保存按钮
    // - 查看(pageState=1)： 输入框有数据，显示：关闭按钮
    // - 编辑(pageState=2)： 输入框有数据，显示：保存按钮 + 关闭按钮
    //var pageState = 2;
    try {
        User.findOne({id:id},function(err,info){
            if(err)  next(err);
            var img = info.image || '/image/avatar/default_avatar.gif';
            //var avatar_src = '/image/avatar/' + img;
            check(id, "流水号不能为空！").notNull();
            res.render('adm/edit_customer_info', { layout: false, id:id, avatar_src: img});
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};
exports.upload_avatar = function(req, res, next) {
    var ep = EventProxy.create();
    var form = new formidable.IncomingForm();
    var id=req.params.id;
    var image;
    console.log('in adm.js  upload_avatar id='+id);

    ep.once('error', function(result) {
        ep.unbind();//remove all event
        return feedback(result);
    });
    ep.on('update', function() {
        var user = req.session.user;
        if(user.id == id){
            updateSession();
        }
        else{
            ep.trigger('done',image);
        }
    });
    ep.on('done', function(avatar_src) {
        //res.redirect('/customer/change_info');
        console.log(avatar_src);
        var rsJson = {avatar_src: avatar_src, message: '头像更新成功，点击保存退出！'};
        res.json(rsJson, 201);
    });


    form.uploadDir = path.join(__dirname, '../public/image/avatar/');
    form.encoding='utf-8';
    form.maxFieldsSize=20*1024*1024;
    form.keepExtensions=false;

    form.parse(req, function(error, fields, files) {
        //console.log('in if condition'+sys.inspect({fields: fields, files: files}));
        if(error) throw error;
        var user = req.session.user;
        var avatar_src = files.avatar.path + ".gif";
        if(files.avatar.size !== 0) {
            image = '/image/avatar/' + path.basename(avatar_src);
            fs.renameSync(files.avatar.path, avatar_src);
//            User.update({id: id, image: image}, function(err, info) {
//                if(err) next(err);
//                if(info) {
//                    //console.log("info: " + sys.inspect(info));
//                    ep.trigger('update');
//                }
//            });
            ep.trigger('update');
        }else {
            //image = user.image;
            ep.trigger('update');
        }
    });

    function updateSession() {
        var user = req.session.user;
        var member = req.session.user.member;
        User.findOne({'id': user.id}, function(err, result) {
            if(err) next(err);
            req.session.user = result;
            req.session.user.member = member;
            ep.trigger('done', result.image);
        });
    }
};

exports.updateUser = function(req, res, next) {
    console.log("updateUser。。。");
    //开始校验输入数值的正确性
    var id = req.body.id;
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var tel = req.body.tel;
    var email = req.body.email;
    var image = req.body.image;
    //console.log(image);
    try {
        check(id, "保存失败，编号不能为空！").notNull();
        check(username, "保存失败，用户名不能为空！").notNull();
        check(password, "保存失败，密码不能为空！").notNull();
        check(name, "保存失败，姓名不能为空！").notNull();
        check(tel, "保存失败，电话不能为空！").notNull();
        check(email, "保存失败，电子邮件不正确！").isEmail();
        //说明是更新数据
        User.update({id:id, username:username, password:password, name:name, tel:tel, email:email,image:image}, function(err,info){
            if(err) return next(err);

            //res.json({status:200, error:'更新商品信息成功!'}, 200);
            var jsonObj = {user:{id:info.insertId}};
            return res.json(jsonObj, 200);
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};

exports.deleteUser = function(req, res, next) {

    var ids = req.params.ids;
    console.log("开始进行删除user。。。。ids="+ids);

    try {
        check(ids, "删除失败，编号不能为空！").notNull();

        User.delete(ids, function(err,ds){
            if(err) return next(err);
            return res.json({"status":200, "error":'删除用户信息成功!'}, 200);
            });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};
exports.authority_customer_add = function(req, res, next){
    var id= req.params.id;
    res.render('adm/authority_customer_info',{layout:false,id:id});
};
exports.authority_customer_delete = function(req, res, next){
    var id= req.params.id;
    res.render('adm/authority_customer_info_delete',{layout:false,id:id});
};
exports.findall_add_authority = function(req, res, next){
    var cus_id= req.params.id;

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
    var where = ' and id not in (select restaurant_id from member where role=2 and user_id='+cus_id+")";

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
        console.log(count.count);
        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});
        ep.trigger('findAllForWeb', where, count.count);
    });

    function findAllForWeb(where, count) {
        var showElement = ['id', 'name'];

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
                rows.id = rs[i].id;
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
//            for(var i=0; i<rs.length;i++){
//                Member.findOne({user_id:_id,restaurant_id:rs[i]},function(err,info){
//
//                });
//            }

            var jsonStr = JSON.stringify(jsonObj);
            console.log('jsonStr-restaurants:'+jsonStr);
            return res.json(jsonObj, 200);

        });
    };
};
exports.findall_delete_authority = function(req, res, next){
    var cus_id= req.params.id;

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
    var where = ' and id in (select restaurant_id from member where role=2 and user_id='+cus_id+")";

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
        console.log(count.count);
        if (!count && !count.count) return ep.trigger('error', {status:204, error:'查询结果为空!'});
        ep.trigger('findAllForWeb', where, count.count);
    });

    function findAllForWeb(where, count) {
        var showElement = ['id', 'name'];

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
                rows.id = rs[i].id;
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
//            for(var i=0; i<rs.length;i++){
//                Member.findOne({user_id:_id,restaurant_id:rs[i]},function(err,info){
//
//                });
//            }

            var jsonStr = JSON.stringify(jsonObj);
            console.log('jsonStr-restaurants:'+jsonStr);
            return res.json(jsonObj, 200);

        });
    };
};
exports.addauthority = function(req, res, next){
    var cus_id = req.query.cus_id;
    var res_id = req.query.res_id;
    console.log(cus_id);
    console.log(res_id);
    Member.create({role:2,user_id:cus_id,restaurant_id:res_id},function(err,info){
        if(err) return next(err);

        //res.json({status:200, error:'更新商品信息成功!'}, 200);
        var jsonObj = {member:{id:info.insertId}};
       // console.log(jsonObj);
        return res.json(jsonObj, 200);
    });

};
exports.deleteauthority = function(req, res, next){
    var cus_id = req.query.cus_id;
    var res_id = req.query.res_id;
//    console.log(cus_id);
//    console.log(res_id);
    Member.delete1({role:2,user_id:cus_id,restaurant_id:res_id},function(err,info){
        if(err) return next(err);

        //res.json({status:200, error:'更新商品信息成功!'}, 200);
        var jsonObj = {member:{id:info.insertId}};
        //console.log(jsonObj);
        return res.json(jsonObj, 200);
    });

};


exports.change_restaurant_info = function(req, res, next){
    res.render('adm/change_restaurant_info',{title:'店铺信息管理'});

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
                rows.id = rs[i].id;
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
exports.restaurantpageEdit = function(req, res, next) {
    var id = req.params.id;
    console.log("开始 restaurantpageEdit 。。。id="+id);
    try {
        Restaurant.findOne({id:id}, function(err,rs){
            if(err) return next(err);
            var img = rs.image || '/image/restaurant/default_restaurant.gif';
            //var restaurant_src = '/image/restaurant/' + img;
            check(id, "流水号不能为空！").notNull();
            res.render('adm/edit_restaurant_info', { layout: false, id:id,restaurant_src: img});
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};
exports.upload_restaurant = function(req, res, next) {
    var ep = EventProxy.create();
    var form = new formidable.IncomingForm();
    var id=req.params.id;
    var image;
    console.log('in adm.js  upload_restaurant id='+id);

    ep.once('error', function(result) {
        ep.unbind();//remove all event
        return feedback(result);
    });
    ep.on('done', function(restaurant_src) {
        //res.redirect('/customer/change_info');
        //console.log(restaurant_src);
        var rsJson = {restaurant_src: restaurant_src, message: '店铺图片更新成功，点击保存退出！'};
        res.json(rsJson, 201);
    });


    form.uploadDir = path.join(__dirname, '../public/image/restaurant/');
    form.encoding='utf-8';
    form.maxFieldsSize=20*1024*1024;
    form.keepExtensions=false;

    form.parse(req, function(error, fields, files) {
        //console.log('in if condition'+sys.inspect({fields: fields, files: files}));
        if(error) throw error;
        //var user = req.session.user;
        var restaurant_src = files.restaurant.path + ".gif";
        if(files.restaurant.size !== 0) {
            image = '/image/restaurant/' + path.basename(restaurant_src);
            fs.renameSync(files.restaurant.path, restaurant_src);
//            Restaurant.update({id: id, image: image}, function(err, info) {
//                if(err) next(err);
//                if(info) {
//                    //console.log("info: " + sys.inspect(info));
//                    console.log('succ');
//                    ep.trigger('done',image);
//                }
//            });
            ep.trigger('done',image);
        }else {
            //image = user.image;
            ep.trigger('update',image);
        }
    });
};
exports.updateRestaurant = function(req, res, next) {
    console.log("updateRestaurant。。。");
    //开始校验输入数值的正确性
    var id = req.body.id;
    var name = req.body.name;
    var tel = req.body.tel;
    var address = req.body.address;
    var intro = req.body.intro;
    var image = req.body.image;
    //console.log(image);
    try {
        check(id, "保存失败，编号不能为空！").notNull();
        check(name, "保存失败，姓名不能为空！").notNull();
        check(tel, "保存失败，电话不能为空！").notNull();
        check(address, "保存失败，地址不能为空！").notNull();
        check(intro, "保存失败，简要介绍不能为空！").notNull();
        //说明是更新数据
        Restaurant.update({id:id, name:name, tel:tel, address:address, intro:intro,image:image}, function(err,info){
            if(err) return next(err);

            //res.json({status:200, error:'更新商品信息成功!'}, 200);
            var jsonObj = {restaurant:{id:info.insertId}};
            return res.json(jsonObj, 200);
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};

exports.deleteRestaurant = function(req, res, next) {

    var ids = req.params.ids;
    console.log("开始进行删除restaurant。。。。ids="+ids);

    try {
        check(ids, "删除失败，编号不能为空！").notNull();

        Restaurant.delete(ids, function(err,ds){
            if(err) return next(err);
            return res.json({"status":200, "error":'删除店铺信息成功!'}, 200);
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};
exports.addpageRestaurant= function(req, res, next) {
    console.log("新建店铺。。。");
    try {
        var img = 'default_restaurant.gif';
        var restaurant_src = '/image/restaurant/' + img;
        //check(id, "流水号不能为空！").notNull();
        res.render('adm/add_restaurant_info', { layout: false, restaurant_src: restaurant_src});
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};
exports.addRestaurant= function(req, res, next) {
    console.log("save new restaurant。。。");
    //开始校验输入数值的正确性
    var name = req.body.name;
    var tel = req.body.tel;
    var address = req.body.address;
    var intro = req.body.intro;
    var image = req.body.image;

    try {
        check(name, "保存失败，名称不能为空！").notNull();
        check(tel, "保存失败，电话不能为空！").notNull();
        check(address, "保存失败，地址不能为空！").notNull();
        check(intro, "保存失败，简要介绍不能为空！").notNull();

        //创建时间
        Restaurant.create({name:name, tel:tel, address:address, intro:intro,image:image}, function(err,info){
            if(err) return next(err);

            //res.json({status:200, error:'更新商品信息成功!'}, 200);
            var jsonObj = {restaurant:{id:info.insertId}};
            return res.json(jsonObj, 200);
        });
    }catch(e){
        res.json({status:400, error:e.message}, 400);
    }
};