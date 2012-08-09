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
var fs = require('fs');

var sys = require('sys');

exports.change_info = function(req, res, next) {
    var method = req.method.toLowerCase();
    if(method == 'get') {
        var user = req.session.user;
        var img = user.image || 'default_avatar.gif';
        var avatar_src = '/image/avatar/' + img;
        res.render('customer/change_info',{title: '更改用户信息', id: user.id, username: user.username, name: user.name, tel: user.tel, email: user.email, avatar_src: avatar_src});
        return;
    }
    if(method == 'post') {

    }
}


exports.change_avatar = function(req, res, next) {
    console.log("in customer, change_avatar.");
//    console.log("in customer, req: " + sys.inspect(req.files));

    var form = new formidable.IncomingForm();

//    var filePath = "E:\\webstormspace\\509_meal_ordering\\public\\image\\avatar\\";
    var filePath = __dirname + '\\public\\image\\avatar'
    form.uploadDir = filePath;
    form.encoding='utf-8';
    form.maxFieldsSize=5*1024*1024;
    form.keepExtensions=false;

    form.parse(req, function(error, fields, files) {
        console.log('in if condition'+sys.inspect({fields: fields, files: files}));
        /*if(error) throw error;
        var user = req.session.user;
        console.log("parsing done");

        var fileName = new Date().toString() + ".png";

        console.log("file.upload: " + sys.inspect(files.upload));

        fs.renameSync(files.upload.path, filePath + fileName);

        fs.writeFile(fileName, files.upload,'utf8', function (err) {
            if (err) next(err);
            console.log('It\'s saved!');

            User.update({id: user.id, image: fileName}, function(err, info) {
                if(err) next(err);
                if(info) {
                    res.redirect('http://localhost:8888/customer/change_info');
                    return;
                }
            });
        });*/
    });


}