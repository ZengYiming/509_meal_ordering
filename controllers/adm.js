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

var check = require('validator').check;
var sanitize = require('validator').sanitize;
var config = require('../config').config;

exports.change_customer_info = function(req, res, next){
    res.render('adm/change_customer_info',{title: '更改用户信息'});
};
exports.change_customer_info_success = function(req, res, next){
    res.send('更改用户信息成功！');
};