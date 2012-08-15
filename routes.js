/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-6
 * Time: 上午10:58
 * To change this template use File | Settings | File Templates.
 */

//var sys = require("sys");

var site = require("./controllers/site")
var sign = require("./controllers/sign");
var customer = require("./controllers/customer");
var adm = require("./controllers/adm");

function auth_role(req, res, next, role) {
    if(req.session.user) {
        var user = req.session.user;
        for(var k in user.member) {
            if(user.member[k].role == role) {
                next();
                return;
            }
        }
        res.render('index', {error: '无权限进行此操作'});
    }
    //else res.send(401);
    else{
        var refer = req.headers.referer || 'home';
        req.session._loginReferer = refer;
        res.render('sign/signin');
    }
}

var authToCustomer = function(req, res, next) {
    auth_role(req, res, next, 1);
}
var authToAdm = function(req, res, next) {
    auth_role(req, res, next, 0);
}
var authToRes_adm = function(req, res, next) {
    auth_role(req, res, next, 2);
}

exprots = module.exports = function(app) {

    app.get('/', site.index);
    app.post('/headline',site.headLine);

    // sign up, login, logout
    app.get('/signin', sign.showLogin);
    app.post('/signin', sign.login);
    app.all('/signup', sign.signup);
    app.get('/signout', sign.signout);

    // customer
    app.all('/customer/change_info', authToCustomer, customer.change_info);
    //adm
    app.get('/adm/adm_control_panel', authToAdm,adm.adm_control_panel);
    app.get('/adm/change_customer_info',authToAdm,adm.change_customer_info);
    app.get('/adm/change_customer_info/findall',authToAdm,adm.findallusers);
    app.get('/adm/change_customer_info/edit/:_id',authToAdm,adm.pageEdit);

    app.get('/adm/change_restaurant_info',authToAdm,adm.change_restaurant_info);
    app.get('/adm/change_restaurant_info/findall',authToAdm,adm.findallrestaurants);

};