/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-22
 * Time: 下午2:21
 * To change this template use File | Settings | File Templates.
 */

var mysql = require('../dao/mysql.js');

var SimpleDO = require('../dao/simpleDO');

function createRole() {
    return new Role();
};

function Role() {
};
Role.prototype = new SimpleDO('`role`');

exports = module.exports = createRole;