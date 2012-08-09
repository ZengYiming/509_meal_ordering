/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-6
 * Time: 上午10:58
 * To change this template use File | Settings | File Templates.
 */

var sign = require("./controllers/sign");

var authToMember = function(req, res, next) {
    if(req.session.user) next();
    //else res.send(401);
    else{
        var refer = req.headers.referer || 'home';
        req.session._loginReferer = refer;
        res.render('sign/signin');
    }
};

exprots = module.exports = function(app) {

    // sign up, login, logout
    app.get('/signin', sign.showLogin);
    app.post('/signin', sign.login);
    app.get('/signout', sign.signout);
};