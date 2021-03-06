var models = require('../models');
var User = models.User;
var Member = models.Member;

var check = require('validator').check;
var sanitize = require('validator').sanitize;

//var crypto = require('crypto');
//var bcrypt = require('bcrypt');

var config = require('../config').config;
var EventProxy = require('eventproxy').EventProxy;

//var sys = require("sys");

//var Log = require('../log.js');
//var log = Log.create(Log.INFO, {'file':'public/node.debug'});
//var MQClient = require('../libs/mq_client.js');


/*var message_ctrl = require('./message');
var mail_ctrl = require('./mail');*/

//sign up
exports.signup = function(req,res,next){
    var ep = EventProxy.create();
    ep.once('error', function(result) {
        ep.unbind();//remove all event
        return feedback(result);
    });
    ep.on('user', function(user_id) {
        createMember(user_id);
    });
    ep.on('member', function(user_id) {
        //res.render('index', {error: '注册成功。'});
        res.json({}, 200);
        return;
    });

	var method = req.method.toLowerCase();
	if(method == 'get'){
		res.render('sign/signup.jade',{layout: false, title: '用户注册'});
		return;
	}
	if(method == 'post'){
		var username = sanitize(req.body.username).trim();
		username = sanitize(username).xss();
		username = username.toLowerCase();
		var pass = sanitize(req.body.password).trim();
		pass = sanitize(pass).xss();
        var re_pass = sanitize(req.body.re_pass).trim();
        re_pass = sanitize(re_pass).xss();
        var name = sanitize(req.body.name).trim();
        name = sanitize(name).xss();
        var tel = sanitize(req.body.tel).trim();
        tel = sanitize(tel).xss();
		var email = sanitize(req.body.email).trim();
		email = email.toLowerCase();
		email = sanitize(email).xss();
		
		if(username == '' || pass =='' || re_pass == '' || tel ==''){
			//res.render('sign/signup.jade', {error:'信息不完整。',name:name,tel:tel,email:email});
            res.json({status: 412, error: '信息不完整'}, 412);
			return;
		}

		if(username.length < 6){
			//res.render('sign/signup.jade', {error:'用户名至少需要6个字符。',name:name,tel:tel,email:email});
            res.json({status: 400, error: '用户名至少需要6个字符'}, 400);
			return;
		}

        if(pass.length < 6){
            //res.render('sign/signup.jade', {error:'密码至少需要6个字符。',name:name,tel:tel,email:email});
            res.json({status: 400, error: '密码至少需要6个字符'}, 400);
            return;
        }

		try{
			check(username, '用户名只能使用0-9，a-z，A-Z。').isAlphanumeric();
		}catch(e){
			//res.render('sign/signup.jade', {error:e.message,name:name,tel:tel,email:email});
            res.json({status: 400, error: e.message}, 400);
			return;
		}

		if(pass != re_pass){
			//res.render('sign/signup.jade', {error:'两次密码输入不一致。',name:name,tel:tel,email:email});
            res.json({status: 400, error: '两次密码输入不一致'}, 400);
			return;
		}
			
		try{
			check(email, '不正确的电子邮箱。').isEmail();
		}catch(e){
			//res.render('sign/signup.jade', {error:e.message,name:name,tel:tel,email:''});
            res.json({status: 400, error: e.message}, 400);
			return;
		}

		User.find({'username':username},function(err,users){
			if(err) return next(err);
			if(users.length > 0){
				//res.render('sign/signup', {error:'用户名已被使用。',name:name,tel:tel,email:email});
                res.json({status: 400, error: '用户名已被使用'}, 400);
				return;
			}
			
			/*// md5 the pass
			pass = md5(pass);
			// create gavatar
			var avatar_url = 'http://www.gravatar.com/image/' + md5(email) + '?size=48';*/

			var body = {username: username, password: pass, name: name, tel: tel, email: email};

			User.create(body, function(err, info){
				if(err) return next(err);
                if(info) {
                    ep.trigger('user', info.insertId);
                 //   res.render('index', {success: '注册成功。'});
                 //   return;
                }
				/*mail_ctrl.send_active_mail(email,md5(email+config.session_secret),name,email,function(err,success){
					if(success){
						res.render('home', {success:'欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'});
						return;
					}
				});*/
			});
		});

        function createMember(userId) {
            var body = {role: 1, user_id: userId, credits: 0}
            Member.create(body, function(err, info) {
                if(err) return next(err);
                if(info) {
                    ep.trigger('member')
                }
            });
        }
	}
};
/**
 * Show user login page.
 * 
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */
exports.showLogin = function(req, res) {
    var refer = req.headers.referer || 'home';
//    console.log("in sign.js, req.headers: " + sys.inspect(req.headers))
//    console.log("in sign.js, req.session.user: " + sys.inspect(req.session.user));
    if(req.session.user) {
        res.redirect(refer);
    } else {
        req.session._loginReferer = refer;
        res.render('sign/signin', {title: '欢迎登陆', error: ''});
    }
};
/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
    '/user/change_psw', //password changing page
    '/signup',         //regist page
    '/user/change_info'
];
/**
 * Handle user login.
 * 
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function} next
 */
exports.login = function(req, res, next) {
    if (!req.body || !req.body.username || !req.body.password) {
        return feedback({status:401, error:'信息不完整。'});
    }    
    var username = sanitize(req.body.username).trim().toLowerCase();
    var pass = sanitize(req.body.password).trim();
//    var org = parseInt(sanitize(req.body.org).trim());
    var ep = EventProxy.create();
    
    function feedback(result) {
//        MQClient.pub('UserLogin', req.session.user);
        if(200 == result.status) {
            var user = req.session.user;
            if(req.accepts('html')) {
                //check at some page just jump to home page 
                /*var refer = req.session._loginReferer || 'home';
                for (var i=0, len=notJump.length; i!=len; ++i) {
                    if (refer.indexOf(notJump[i]) >= 0) {
                        refer = 'home';
                        break;
                    }
                }*/
                var refer = 'home';
                res.redirect(refer);
            }
            else {
                var user = req.session.user;
               /* var data = {
                    _id:user._id,
                    name:user.name,
                    sex:user.sex,
                    role:user.role
                };*//*
                res.json(data, result.status);*/
            }
        }
        else {
            if(req.accepts('html')) res.render('sign/signin', {error:result.error, title:'欢迎登陆'});
            else res.send(result.status);
        }
    };
    
    ep.once('error', function(result) {
        ep.unbind();//remove all event
        return feedback(result);
    });
    ep.on('member', function() {
//        findRole(member.role_id);
//        var user = req.session.user;
//        for(var k in user.member) {
//            if(user.member[k].role == 0) {
//                //跳转到admin页面
//                res.render('adm/adm_control_panel',{title: '系统管理员控制面板'});
//                return;
//            }
//        }
        feedback({status:200, error:'登陆成功'});
    });
/*    ep.on('role', function() {
        feedback({status:200, error:'登陆成功'});
    });*/

    //check user info
    User.findOne({ 'username': username }, function(err, user) {
        if (err) return next(err);
        if (!user) return feedback({status:401, error:'这个用户不存在。'});
        //pass = md5(pass);
        //var salt = bcrypt.genSaltSync(10);  
        //pass = bcrypt.hashSync(pass, salt);
//        console.log(pass, '\r', user.password); 
//        if (!bcrypt.compareSync(pass, user.password)) return feedback({status:401, error:'密码错误。'});
//        if (pass !== user.password) return feedback({status:401, error:'密码错误。'});
//        if (!user.state) return feedback({status:403, error:'此帐号还没有被激活。'});
        if (pass !== user.password) return feedback({status:401, error:'密码错误。'});
        // store session cookie
      //  req.session.regenerate(function() {
            req.session.user = user;
            Member.findByUserId({user_id:user.id}, function(err, member) {
                if(err) { ep.unbind(); return next(err);}
                if (!member) return ep.trigger('error', {status:401, error:'此用户无任何角色'});
                req.session.user.member = member;
                ep.trigger('member');
            });
      //  });
        //gen_session(user, res);
    });
    
/*    function findRole(role_id) {
        Role.findOneWithRoute({_id:role_id}, function(err, role) {
            if(err) { ep.unbind(); return next(err);}
            if (!role) return ep.trigger('error', {status:403, error:'用户权限不存在。'});
            req.session.user.role = role;
            ep.trigger('role');
        });
    }*/
};

// sign out
exports.signout = function(req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, { path: '/' });
    if(req.accepts('html')) {
        res.redirect('home');
    }
    else res.send(200);
};
/*
exports.active_account = function(req,res,next) {
	var key = req.query.key;
	var name = req.query.name;
	var email = req.query.email;

	User.findOne({name:name},function(err,user){
		if(!user || md5(email+config.session_secret) != key){
			res.render('notify/notify',{error: '信息有误，帐号无法被激活。'});
			return;
		}
		if(user.active){
			res.render('notify/notify',{error: '帐号已经是激活状态。'});
			return;
		}
		user.active = true;
		user.save(function(err){
			res.render('notify/notify',{success: '帐号已被激活，请登录'});
		});	
	});
}

exports.search_pass = function(req,res,next){
	var method = req.method.toLowerCase();
	if(method == 'get'){
		res.render('sign/search_pass');
	}
	if(method == 'post'){
		var email = req.body.email;
		email = email.toLowerCase();

		try{
			check(email, '不正确的电子邮箱。').isEmail();
		}catch(e){
			res.render('sign/search_pass', {error:e.message,email:email});
			return;
		}

		// User.findOne({email:email},function(err,user){
    //动态生成retrive_key和timestamp到users collection,之后重置密码进行验证
    var retrieveKey = randomString(15);
    var retrieveTime = new Date().getTime();
    User.findOne({email : email}, function(err, user) {
        if(!user) {
          res.render('sign/search_pass', {error:'没有这个电子邮箱。',email:email});
          return;
        }
        user.retrieve_key = retrieveKey;
        user.retrieve_time = retrieveTime;
        user.save(function(err) {
          if(err) {
            return next(err);
          }
          mail_ctrl.send_reset_pass_mail(email, retrieveKey, user.name, function(err,success) {
          res.render('notify/notify',{success: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。'});
        });
			});
		});
	}	
}
/**
 * reset password
 * 'get' to show the page, 'post' to reset password
 * after reset password, retrieve_key&time will be destroy
 * @param  {http.req}   req  
 * @param  {http.res}   res 
 * @param  {Function} next 
 *
exports.reset_pass = function(req,res,next) {
  var method = req.method.toLowerCase();
  if(method === 'get') {
    var key = req.query.key;
    var name = req.query.name;
    User.findOne({name:name, retrieve_key:key},function(err,user) {
      if(!user) {
        return res.render('notify/notify',{error: '信息有误，密码无法重置。'});
      }
      var now = new Date().getTime();
      var oneDay = 1000 * 60 * 60 * 24;
      if(!user.retrieve_time || now - user.retrieve_time > oneDay) {
        return res.render('notify/notify', {error : '该链接已过期，请重新申请。'});
      }
      return res.render('sign/reset', {name : name, key : key});
    });    
  } else {
    var psw = req.body.psw || '';
    var repsw = req.body.repsw || '';
    var key = req.body.key || '';
    var name = req.body.name || '';
    if(psw !== repsw) {
      return res.render('sign/reset', {name : name, key : key, error : '两次密码输入不一致。'});
    }
    User.findOne({name:name, retrieve_key: key}, function(err, user) {
      if(!user) {
        return res.render('notify/notify', {error : '错误的激活链接'});
      }
      user.pass = md5(psw);
      user.retrieve_key = null;
      user.retrieve_time = null;
      user.save(function(err) {
        if(err) {
          return next(err);
        }
        return res.render('notify/notify', {success: '你的密码已重置。'});
      })
    })
  }
}
*/
// auth_user middleware
exports.auth_user = function(req,res,next){
	if(req.session.user){
		/*if(config.admins[req.session.user.name]){
			req.session.user.is_admin = true;
		}
		message_ctrl.get_messages_count(req.session.user._id,function(err,count){
			if(err) return next(err);
			req.session.user.messages_count = count;
			res.local('current_user',req.session.user);
			return next();
		});*/
                res.local('current_user', req.session.user);
                return next();
	}else{
		var cookie = req.cookies[config.auth_cookie_name];
		if(!cookie) return next();
                next();
/*
		var auth_token = decrypt(cookie, config.session_secret);
		var auth = auth_token.split('\t');
		var user_id = auth[0];
		User.findOne({_id:user_id},function(err,user){
			if(err) return next(err);
			if(user){
				if(config.admins[user.name]){
					user.is_admin = true;
				}
				message_ctrl.get_messages_count(user._id,function(err,count){
					if(err) return next(err);
					user.messages_count = count;
					req.session.user = user;
					res.local('current_user',req.session.user);
					return next();
				});
			}else{
				return next();	
			}
		});	*/
	}
};

// private
function gen_session(user,res) {
    var auth_token = encrypt(user.gid + '\t'+user.username + '\t' + user.password +'\t' + user.email, config.session_secret);
    res.cookie(config.auth_cookie_name, auth_token, {path: '/',maxAge: 1000*60*60*24*30}); //cookie 有效期30天	
    res.local('current_user', user);
}
/*function encrypt(str,secret) {
   var cipher = crypto.createCipher('aes192', secret);
   var enc = cipher.update(str,'utf8','hex');
   enc += cipher.final('hex');
   return enc;
}
function decrypt(str,secret) {
   var decipher = crypto.createDecipher('aes192', secret);
   var dec = decipher.update(str,'hex','utf8');
   dec += decipher.final('utf8');
   return dec;
}
function md5(str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}*/
function randomString(size) {
	size = size || 6;
	var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';	
	var max_num = code_string.length + 1;
	var new_pass = '';
	while(size>0){
	  new_pass += code_string.charAt(Math.floor(Math.random()* max_num));
	  size--;	
	}
	return new_pass;
}
/*
function UserLogin(data) {
    log.info("Sign UserLogin cb\t");
}
MQClient.sub('UserLogin', UserLogin);*/
