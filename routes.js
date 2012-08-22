/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-6
 * Time: 上午10:58
 * To change this template use File | Settings | File Templates.
 */

var sys = require("sys");
var url = require("url");

var site = require("./controllers/site");
var sign = require("./controllers/sign");
var customer = require("./controllers/customer");
var user = require("./controllers/user");
var shopping_cart = require("./controllers/shopping_cart");
var adm = require("./controllers/adm");
var order = require("./controllers/order");
var resadm = require("./controllers/resadm");
var dish = require("./controllers/dish");

var test = require('./controllers/test');
var Auth = require('./controllers/auth');

function auth(req, res, next) {
    if(req.session.user) {
        next();
        return;
    }else {
        var refer = req.header.referer || 'home';
        req.session._loginReferer = refer;
        res.render('sign/signin');
    }
}

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
    console.log("in routes.js, url: " + url.parse(req.url).pathname);
    auth_role(req, res, next, 1);
}
var authToAdm = function(req, res, next) {
    auth_role(req, res, next, 0);
}
var authToRes_adm = function(req, res, next) {
    auth_role(req, res, next, 2);
}

exprots = module.exports = function(app) {

    //site
    app.get('/', site.index);
    app.post('/headline', site.headLine);
    app.get('/dish_info/:dish_id', site.dish_info);
    app.get('/homepage', site.homepage);
    app.get('/dish_list/:res_id', site.dish_list);
    app.get('/show_credits', site.show_credits);

    // sign up, login, logout
    app.get('/signin', sign.showLogin);
    app.post('/signin', sign.login);
    app.all('/signup', sign.signup);
    app.get('/signout', sign.signout);

    //user
    app.all('/user/change_info', auth, user.change_info);
    app.post('/user/upload_avatar', auth, user.upload_avatar);
    app.get('/user/index', auth, user.index);
    app.all('/user/change_psw', auth, user.change_psw);

    // customer
    app.post('/customer/shopping_cart_add', authToCustomer, shopping_cart.add);
    app.get('/customer/shopping_cart_del', authToCustomer, shopping_cart.del);
    app.get('/customer/shopping_cart', authToCustomer, shopping_cart.show);
    app.get('/customer/shopping_cart_clear', authToCustomer, shopping_cart.clear);
    app.all('/customer/order_add', authToCustomer, order.add);
    app.get('/customer/order_list', authToCustomer, order.show_list);
    app.get('/customer/order_info/:order_id', authToCustomer, order.show_info);
    app.get('/customer/order_del/:order_id', authToCustomer, order.del);

    //adm
    app.get('/adm/change_customer_info',authToAdm,adm.change_customer_info);
    app.get('/adm/change_customer_info/findall',authToAdm,adm.findallusers);
    app.get('/adm/change_customer_info/edit/:id',authToAdm,adm.userpageEdit);
    app.post('/adm/edit_customer_info/update',authToAdm,adm.updateUser);
    app.delete('/adm/change_customer_info/delete/:ids',authToAdm,adm.deleteUser);
    app.post('/adm/change_customer_info/upload_avatar',authToAdm,adm.upload_avatar);
    app.get('/adm/change_customer_info/authority/add/:id',authToAdm,adm.authority_customer_add);
    app.get('/adm/change_customer_info/authority/delete/:id',authToAdm,adm.authority_customer_delete);
    app.get('/adm/authority_customer_info/findall/:id',authToAdm,adm.findall_add_authority);
    app.get('/adm/authority_customer_info_delete/findall/:id',authToAdm,adm.findall_delete_authority);
    app.get('/adm/authority_customer_info/add',authToAdm,adm.addauthority);
    app.get('/adm/authority_customer_info/delete',authToAdm,adm.deleteauthority);
    //adm restaurant
    app.get('/adm/change_restaurant_info',authToAdm,adm.change_restaurant_info);
    app.get('/adm/change_restaurant_info/findall',authToAdm,adm.findallrestaurants);
    app.get('/adm/change_restaurant_info/edit/:id',authToAdm,adm.restaurantpageEdit);
    app.post('/adm/edit_restaurant_info/update',authToAdm,adm.updateRestaurant);
    app.delete('/adm/change_restaurant_info/delete/:ids', authToAdm,adm.deleteRestaurant);
    app.get('/adm/change_restaurant_info/add',authToAdm,adm.addpageRestaurant);
    app.post('/adm/add_restaurant_info',authToAdm,adm.addRestaurant);
    app.post('/adm/change_customer_info/upload_restaurant',authToAdm,adm.upload_restaurant);
    //res adm
    app.get('/res_adm/get_res',authToRes_adm,resadm.get_res);
    app.get('/res_adm/choose_restaurant/:id',authToRes_adm,dish.change_dish_info);
    app.get('/res_adm/change_dish_info/findall/:res_id',authToRes_adm,dish.findalldish);
    app.get('/res_adm/change_dish_info/add',authToRes_adm,dish.addpageDish);
    app.post('/res_adm/add_dish_info',authToRes_adm,dish.addDish);
    app.delete('/res_adm/change_dish_info/delete/:res_ids',authToRes_adm,dish.deleteDish);
    app.get('/res_adm/change_dish_info/edit/:id',authToRes_adm,dish.dishpageEdit);
    app.post('/res_adm/edit_dish_info/update',authToRes_adm,dish.updateDish);
    app.post('/res_adm/change_dish_info/upload_dish',authToRes_adm,dish.upload_dish);
    app.get('/res_adm/order/findall/:id',authToRes_adm,order.findallorder);
    app.get('/res_adm/order/dish',authToRes_adm,order.showdish);
    app.get('/res_adm/order/dish/findall',authToRes_adm,order.finddish);
    app.get('/res_adm/order/confirm/:id',authToRes_adm,order.confirm);
    app.get('/res_adm/order/cancel/:id',authToRes_adm,order.cancel);
    app.get('/res_adm/order/send/:id',authToRes_adm,order.sendd);
    app.get('/res_adm/order/success/:id',authToRes_adm,order.success);
};