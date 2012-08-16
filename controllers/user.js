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
//var fs = require('fs');
//var path = require('path');
//var sys = require('sys');

exports.index = function(req, res, next, err) {
    var user = req.session.user;
    var img = user.image || 'default_avatar.gif';
    var avatar_src = '/image/avatar/' + img;
    res.render('user/index',{title: '我的首页', error: err, username: user.username, name: user.name, tel: user.tel, email: user.email, avatar_src: avatar_src});
    return;
};

exports.change_psw = function(req, res, next) {
    var method = req.method.toLowerCase();

    if(method == 'get') {
        res.render('user/change_psw');
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
            res.render('user/change_psw', {error: '原密码错误'});
            return;
        }
        if(new_pass.length < 6) {
            res.render('user/change_psw', {error:'密码至少需要6个字符。'});
            return;
        }
        if(new_pass != re_pass) {
            res.render('user/change_psw', {error:'两次密码输入不一致。'});
            return;
        }

        User.update({id: user.id, password: new_pass}, function(err, info) {
            if(err) next(err);
            if(info) {
                //console.log("info: " + sys.inspect(info));
                exports.index(req, res, next, "密码修改成功");
            }
        });
    }
};

exports.change_info = function(req, res, next) {
    var method = req.method.toLowerCase();

    function feedback(err) {
        var user = req.session.user;
        var img = user.image || 'default_avatar.gif';
        var avatar_src = '/image/avatar/' + img;
        res.render('user/change_info',{title: '更改用户信息',error: err, username: user.username, name: user.name, tel: user.tel, email: user.email, avatar_src: avatar_src});
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
            return feedback(result);
        });
        ep.on('update', function() {
            updateSession();
        });
        ep.on('done', function() {
            exports.index(req, res, next, "信息修改成功");
        });


        form.uploadDir = path.join(__dirname, '../public/image/avatar/');
        form.encoding='utf-8';
        form.maxFieldsSize=5*1024*1024;
        form.keepExtensions=false;

        form.parse(req, function(error, fields, files) {
            if(error) throw error;

//            console.log('in if condition'+sys.inspect({fields: fields, files: files}));
            //operate fields
            var name = sanitize(fields.name).trim();
            name = sanitize(name).xss();
            var tel = sanitize(fields.tel).trim();
            tel = sanitize(tel).xss();
            var email = sanitize(fields.email).trim();
            email = email.toLowerCase();
            email = sanitize(email).xss();

            try{
                check(email, '不正确的电子邮箱。').isEmail();
            }catch(e){
                feedback(e.message);
                return;
            }

            //operate files
            var avatar_src = files.upload.path + ".gif";

            fs.renameSync(files.upload.path, avatar_src);

            var image;
            if(files.upload.size !== 0) {
                image = path.basename(avatar_src);
            }else {
                image = user.image;
            }
            User.update({id: user.id, name: name, tel: tel, email: email, image: image}, function(err, info) {
                if(err) next(err);
                if(info) {
                    //console.log("info: " + sys.inspect(info));
                    ep.trigger('update');
                }
            });

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
