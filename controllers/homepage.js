/**
 * Created with JetBrains WebStorm.
 * User: Viya Bai
 * Date: 12-8-8
 * Time: 下午8:28
 * To change this template use File | Settings | File Templates.
 */
var User = require('../models/user')();
//var Role = models.Role;
var Member = require('../models/member')();

var check = require('validator').check;
var sanitize = require('validator').sanitize;

//var crypto = require('crypto');
//var bcrypt = require('bcrypt');

var config = require('../config').config;
var EventProxy = require('eventproxy').EventProxy;

exports.show=function(req,res){
    res.render('homepage/homepage.jade');
};