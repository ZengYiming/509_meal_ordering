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
    var headline;
    if(req.session.user) {
        var user = req.session.user;
        headline = {name: user.name};
        for(var k in user.member) {
            if(user.member[k].role == 1) {
                headline.credits = user.member[k].credits;
                headline.shopping_cart = true;
            }
            else if(user.member[k].role == 0) {
                headline.background = true;
            }
            else if(user.member[k].role == 2) {
                headline.resadm = true;
            }
        }
    }else {
        headline = '';
    }
    res.write(headline.toString());
}
