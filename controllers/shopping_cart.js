/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-13
 * Time: 下午5:20
 * To change this template use File | Settings | File Templates.
 */

exports.add = function(req, res, next) {
    var deal = {dish_id: req.body.id, quantity: req.body.quantity};
    req.session.shopping_cart = [];
    req.session.shopping_cart.push(deal);
};