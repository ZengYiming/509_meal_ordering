/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-20
 * Time: 上午11:06
 * To change this template use File | Settings | File Templates.
 */


var models = require('../models');
var Member = models.Member;
var Restaurant = models.Restaurant;
var EventProxy = require('eventproxy').EventProxy;
var sys = require('sys');

exports.get_res = function(req, res, next) {
    var user = req.session.user;
    var opt = {user_id: user.id, role: 2};
    var ep = EventProxy.create();
    Member.findByUserId(opt, function(e, rs) {
        if(e) return next(e);
        var rsLine = '餐馆管理';
        ep.on('done', function() {
            rsLine += '<li class="last">' +
                '<img class="corner_left" alt="" src="/image/headline/corner_left.png"/>' +
                '<img class="middle" alt="" src="/image/headline/dot.gif"/>' +
                '<img class="corner_right" alt="" src="/image/headline/corner_right.png"/>' +
                '</li>' +
                '</ul>';
            res.write(rsLine);
            res.end();
            return;
        });
        if(rs) {
            //console.log("members: " + sys.inspect(rs));
            ep.after('getRes', rs.length, function() {
                ep.trigger('done');
            });
            rsLine += '<ul id="resadm_sub">' +
                '<li>' +
                '<img class="corner_inset_left" alt="" src="/image/headline/corner_inset_left.png"/>' +
                '管理餐馆数：' + rs.length +
                '<img class="corner_inset_right" alt="" src="/image/headline/corner_inset_right.png"/>'+
                '</li>';
            for(var k in rs) {
                var value = rs[k];
                Restaurant.findOne({id: value.restaurant_id}, function(err, res) {
                    if(err) return next(err);
                    rsLine += '<li><a href="/res_adm/change_dish_info/'+ res.id + '">' + res.name + '</a></li>';
                    ep.trigger('getRes');
                });
            }
        }else {
            rsLine += '<ul id="resadm_sub">' +
                '<li>' +
                '<img class="corner_inset_left" alt="" src="/image/headline/corner_inset_left.png"/>' +
                '无可管理餐馆' +
                '<img class="corner_inset_right" alt="" src="/image/headline/corner_inset_right.png"/>'+
                '</li>';
        }
    })
};
