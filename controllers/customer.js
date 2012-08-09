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

exports.change_info = function(req, res, next) {
    var method = req.method.toLowerCase();
    if(method == 'get') {
        var user = req.session.user;
        var avatar_src = User.image || '/image/avatar/default_avatar.gif';
        res.render('customer/change_info',{title: '更改用户信息', id: user.id, username: user.username, name: user.name, tel: user.tel, email: user.email, avatar_src: avatar_src});
        return;
    }
    if(method == 'post') {

    }
}
