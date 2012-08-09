/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-6
 * Time: 上午10:53
 * To change this template use File | Settings | File Templates.
 */
exports.config = {
    name: "509_meal_ordering",
    description: "509网上订餐系统",
    version: "0.0.1",

    host: "http://127.0.0.1",

    mysql: {
        host: "10.3.4.139",
        port: 3306,
        user: "viya",
        password: "123456",
        database: "meal_ordering",
        timezone: "Asia/Shanghai"
    },
    redis: {
        prot: 6379,
        host: "127.0.0.1"
    },
    session_secret: "509_meal_ordering",
    session_cookie: {maxAge: 60 * 60 * 1000},
    auth_cookie_name: "509_meal_ordering",
    port: 8888
};