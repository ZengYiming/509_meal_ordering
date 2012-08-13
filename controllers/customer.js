/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-9
 * Time: 上午11:17
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




/*exports.change_info = function(req, res, next) {
    var method = req.method.toLowerCase();

    function feedback(err) {
        var user = req.session.user;
        var img = user.image || 'default_avatar.gif';
        var avatar_src = '/image/avatar/' + img;
        res.render('customer/change_info',{title: '更改用户信息',error: err, username: user.username, name: user.name, tel: user.tel, email: user.email, avatar_src: avatar_src});
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
            feedback('修改成功');
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
}*/


/*
exports.change_avatar = function(req, res, next) {
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
        res.redirect('http://localhost:8888/customer/change_info');
    });


    form.uploadDir = path.join(__dirname, '../public/image/avatar/');
    form.encoding='utf-8';
    form.maxFieldsSize=5*1024*1024;
    form.keepExtensions=false;

    form.parse(req, function(error, fields, files) {
        console.log('in if condition'+sys.inspect({fields: fields, files: files}));
        if(error) throw error;
        var user = req.session.user;
        var avatar_src = files.upload.path + ".gif";
        var file_name = path.basename(avatar_src);

        fs.renameSync(files.upload.path, avatar_src);

        User.update({id: user.id, image: file_name}, function(err, info) {
            if(err) next(err);
            if(info) {
                console.log("info: " + sys.inspect(info));
                ep.trigger('update');
//
            }
        });

    });

    function updateSession() {
        var user = req.session.user;
        var member = req.session.user.member;
        User.findOne({'id': user.id}, function(err, result) {
            if(err) next(err);
            req.session.user = result;
            req.session.user.member = member;
            ep.trigger('done');
        });
    }

    return;
}*/
