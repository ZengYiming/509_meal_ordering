/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-8-6
 * Time: 上午10:18
 * To change this template use File | Settings | File Templates.
 */

var express = require("express");
var path = require("path");
var routes = require("./routes");
var config = require("./config").config;
var RedisStore = require("connect-redis")(express);

delete express.bodyParser.parse['multipart/form-data'];

var app = express.createServer();

app.configure(function() {
    var viewsRoot = path.join(__dirname, "views");
    app.set("views", viewsRoot);
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        store: new RedisStore({host: config.redis.host}),
        secret: config.session_secret,
        cookie: config.session_cookie
    }));
    app.use(express.methodOverride());
});

var static_dir = path.join(__dirname, "public");
app.configure("development", function() {
    app.use(express.static(static_dir));
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

routes(app);

app.listen(config.port);