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
var EventProxy = require('eventproxy').EventProxy;

var check = require('validator').check;
var sanitize = require('validator').sanitize;
var config = require('../config').config;

exports.adm_control_panel = function(req, res, next){
    res.render('adm/adm_control_panel',{title: '系统管理员控制面板'});
};
exports.change_customer_info = function(req, res, next){
    res.render('adm/change_customer_info',{title:'用户信息更改'});

};
exports.change_customer_info_success = function(req, res, next){
    res.send('更改用户信息成功！');
};

exports.findallusers = function(req, res, next){

    var ep = EventProxy.create();

    function feedback(result) {
        if(200 == result.status) {
            if(result.jsonObj) {
                var jsonStr = JSON.stringify(result.jsonObj);
                console.log('jsonStr:'+jsonStr);
                return res.json(result.jsonObj, result.status);
            }else{
                ep.trigger('error', {status:204, error:'查询结果为空!'});
            }
        }
        else {
            return res.json(result, result.status);
        }
    };

    //当有异常发生时触发
    ep.once('error', function(result) {
        ep.unbind();//remove all event
        return feedback(result);
    });

    ep.on('showList', function(jsonObj) {
        feedback({status:200, error:'获取数据成功', jsonObj:jsonObj});
    });

    User.findAll({where:''}, function(err, rs) {
        if(err) { ep.unbind(); return next(err);}
        if (!rs || rs == undefined) return ep.trigger('error', {status:204, error:'查询结果为空！'});
        var jsonObj = rs;
        ep.trigger('showList', jsonObj);
    });


}