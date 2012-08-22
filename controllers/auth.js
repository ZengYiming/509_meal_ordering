/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-22
 * Time: 下午2:19
 * To change this template use File | Settings | File Templates.
 */

var models = require('../models');
var Role = models.Role;
var Role_route = models.Role_route;
var Route = models.Route;

var EventProxy = require('eventproxy').EventProxy;
var url = require('url');
var sys = require('sys');

exports.role_route = function(req, res, next) {
    if(req.session.user) {
        var members = req.session.user.member;
        var pathname = url.parse(req.url).pathname.toLowerCase();
        var ep = EventProxy.create();
        ep.on('done', function() {
            next();
            return;
        });

        if(pathname[pathname.length - 1] == '/') {
            pathname = pathname.substr(0, pathname.length - 1);
        }
        for(var k in members) {
            ep.after('members', members.length, function() {
                res.render('test/fail.jade');
                return;
            });

            var member = members[k];
            var rr_opt = {where: 'AND role_id=' + member.role_id};
            Role_route.findAll(rr_opt, function(err, rrs) {
                if(err) return next(err);
                ep.after('rrs', rrs.length, function() {
                    ep.trigger('members');
                });

                for(var i in rrs) {
                    var rr = rrs[i];
                    var route_opt = {id: rr.route_id};
                    Route.findOne(route_opt, function(error, route) {
                        if(error) return next(error);
                        if(route) {
                            console.log('route: ' + sys.inspect(route));
                            var pn = route.pathname;
                            if(pn.length <= pathname.length && pn == pathname.substr(0, pn.length)) {
                                ep.trigger('done');
                            }else {
                                ep.trigger('rrs');
                            }
                        }
                    });
                }
            });
        }
    }
    else{
        res.render('sign/signin');
        return;
    }

};
