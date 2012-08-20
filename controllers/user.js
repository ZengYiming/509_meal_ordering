/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-13
 * Time: 上午9:35
 * To change this template use File | Settings | File Templates.
 */

var models = require('../models');
var User = models.User;

var check = require('validator').check;
var sanitize = require('validator').sanitize;
var config = require('../config').config;
var formidable = require('formidable');
var EventProxy = require('eventproxy').EventProxy;
var fs = require('fs');
var path = require('path');
var sys = require('sys');

exports.index = function(req, res, next, err) {
    var user = req.session.user;
    //console.log('user: ' + sys.inspect(user));
    var avatar_src = user.image || '/image/avatar/default_avatar.gif';
    //console.log('avatar_src: ' + avatar_src);
    //res.render('user/index',{title: '我的首页', error: err, username: user.username, name: user.name, tel: user.tel, email: user.email, avatar_src: avatar_src});
    res.write(user.name + '<ul id="user_info_sub">' +
                '<li>' +
                    '<img class="corner_inset_left" alt="" src="/image/headline/corner_inset_left.png"/>' +
                    '<img src="' + avatar_src + '" name="avatar" alt="avatar" height="50" width="50"/>' +
                    '<img class="corner_inset_right" alt="" src="/image/headline/corner_inset_right.png"/>'+
                '</li>' +
                '<li>' +
                    '用户名：' + user.username +
/*                '</li>' +
                '<li>' +*/
                    '<br/>姓名：' + user.name +
/*                '</li>' +
                '<li>' +*/
                    '<br/>联系电话：' + user.tel +
/*                '</li>' +
                '<li>' +*/
                    '<br/>Email：' + user.email +
                '</li>' +
                '<li>' +
                '<a id="user_info_change">更改信息</a>' +
                '<a id="user_info_psw">重设密码</a>' +
                '</li>' +
                '<li class="last">' +
                    '<img class="corner_left" alt="" src="/image/headline/corner_left.png"/>' +
                    '<img class="middle" alt="" src="/image/headline/dot.gif"/>' +
                    '<img class="corner_right" alt="" src="/image/headline/corner_right.png"/>' +
                '</li>' +
              '</ul>');
    res.end();
    return;
};

exports.change_psw = function(req, res, next) {
    var method = req.method.toLowerCase();

    if(method == 'get') {
        res.render('user/change_psw', {layout: false});
        return;
    }
    if(method == 'post') {
        var user = req.session.user;

        var old_pass = sanitize(req.body.old_pass).trim();
        old_pass = sanitize(old_pass).xss();
        var new_pass = sanitize(req.body.new_pass).trim();
        new_pass = sanitize(new_pass).xss();
        var re_pass = sanitize(req.body.re_pass).trim();
        re_pass = sanitize(re_pass).xss();

        if(user.password != old_pass) {
            res.json({status: 412, error: '原密码错误'}, 412);
            //res.render('user/change_psw', {error: '原密码错误'});
            return;
        }
        if(new_pass.length < 6) {
            res.json({status: 412, error: '密码至少需要6个字符'}, 412);
            //res.render('user/change_psw', {error:'密码至少需要6个字符。'});
            return;
        }
        if(new_pass != re_pass) {
            res.json({status: 412, error: '两次密码输入不一致'}, 412);
            //res.render('user/change_psw', {error:'两次密码输入不一致。'});
            return;
        }

        User.update({id: user.id, password: new_pass}, function(err, info) {
            if(err) next(err);
            if(info) {
                //console.log("in user.js update, info: " + sys.inspect(info));
                //exports.index(req, res, next, "密码修改成功");
                req.session.user.password = new_pass;
                res.json({}, 200);
                return;
            }
        });
    }
};

exports.change_info = function(req, res, next) {
    var method = req.method.toLowerCase();

    function feedback(err) {
        var user = req.session.user;
        var avatar_src = user.image || '/image/avatar/default_avatar.gif';
        res.render('user/change_info',{layout: false, error: err, username: user.username, name: user.name, tel: user.tel, email: user.email, avatar_src: avatar_src});
        return;
    }

    if(method == 'get') {
        feedback('');
    }
    if(method == 'post') {
        var user = req.session.user;
        var ep = EventProxy.create();
        var form = new formidable.IncomingForm();

        ep.once('error', function(result) {
            ep.unbind();//remove all event
            res.json({status: 400, error:result}, 400);
            return;
        });
        ep.on('update', function() {
            updateSession();
        });
        ep.on('done', function() {
            res.json({},200);
        });
            var name = sanitize(req.body.name).trim();
            name = sanitize(name).xss();
            var tel = sanitize(req.body.tel).trim();
            tel = sanitize(tel).xss();
            var email = sanitize(req.body.email).trim();
            email = email.toLowerCase();
            email = sanitize(email).xss();

            try{
                check(email, '不正确的电子邮箱。').isEmail();
            }catch(e){
                //feedback(e.message);
                res.json({status: 400, error:e.message}, 400);
                return;
            }

            User.update({id: user.id, name: name, tel: tel, email: email}, function(err, info) {
                if(err) next(err);
                if(info) {
                    //console.log("info: " + sys.inspect(info));
                    ep.trigger('update');
                }
            });


        function updateSession() {
            var member = req.session.user.member;
            User.findOne({'id': user.id}, function(err, result) {
                if(err) next(err);
                req.session.user = result;
                req.session.user.member = member;
                ep.trigger('done');
            });
        }
    }
    return;
};

exports.upload_avatar = function(req, res, next) {
    console.log("in user.js  upload_avatar");
    var ep = EventProxy.create();
    var form = new formidable.IncomingForm();

    ep.once('error', function(result) {
        ep.unbind();//remove all event
        return feedback(result);
    });
    ep.on('update', function() {
        updateSession();
    });
    ep.on('done', function(avatar_src) {
        //res.redirect('/customer/change_info');
        var rsJson = {avatar_src: avatar_src, message: '头像更新成功'};
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
        var image;
        if(files.avatar.size !== 0) {
            image = '/image/avatar/' + path.basename(avatar_src);
            fs.renameSync(files.avatar.path, avatar_src);
            User.update({id: user.id, image: image}, function(err, info) {
                if(err) next(err);
                if(info) {
                    console.log("info: " + sys.inspect(info));
                    ep.trigger('update');
                }
            });
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
