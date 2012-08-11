/*var tag_ctrl = require('./tag');
var user_ctrl = require('./user');
var topic_ctrl = require('./topic');
var config = require('../config').config;
var EventProxy = require('eventproxy').EventProxy;

var sanitize = require('validator').sanitize;
*/
//var Log = require('../log.js');
//var log = Log.create(Log.INFO, {'file':'public/node.debug'});
//var MQClient = require('../libs/mq_client.js');

exports.index = function(req,res,next){
    res.render('index');
//    res.redirect('/signin');
};

exports.headLine = function (req, res, next) {

}
