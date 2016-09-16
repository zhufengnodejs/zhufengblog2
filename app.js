var express = require('express');
//引入处理路径的path join resolve
var path = require('path');
//用来处理收藏夹图标 /favicon.ico
var favicon = require('serve-favicon');
//请求记录器
var logger = require('morgan');
//用来处理请求中的cookie req.cookies 会把请求头中的cookie字段包装成对象放在req.cookies里
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//处理请求体 req.body 会把请求体转成对象放在req.body上
//请求体分为json和urlencoded
var bodyParser = require('body-parser');
var flash = require('connect-flash');
//首页路由
var routes = require('./routes/index');
// 用户路由，用来响应对用户的操作
var user = require('./routes/user');
var article = require('./routes/article');
require('./db');
//得到请求监听函数
var app = express();

// view engine setup 设置模板引擎
//设置模板存放目录
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎
app.set('view engine', 'html');
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public
//当你把favicon图标放置在public目录下之后就可以取消注释了
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//记录访问日志
app.use(logger('dev'));
//处理请求体为json的请求 {name:'zfpx'} req.body
app.use(bodyParser.json());
//处理请求体为urlencoded name=zfpx&age=6
app.use(bodyParser.urlencoded({ extended: false }));
//处理cookie req.cookies对象
app.use(cookieParser());
// req.session
app.use(session({
  secret:'zfpx',
  resave:true,
  saveUninitialized:true,
  store:new MongoStore({
    url:'mongodb://localhost:27017/zhufengblog2'
  })
}));
app.use(flash());
app.use(function(req,res,next){
  //res.locals 是真正用来渲染模板的对象
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  res.locals.user = req.session.user;
  res.locals.keyword = '';
  next();
});
//静态文件中间件
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//url= /users/reg
app.use('/user', user);
app.use('/article', article);
// catch 404 and forward to error handler
//捕获404错误并且转向错误处理中间件
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
  err.status = 404;
  next(err);*/
  res.render('404');
});

// error handlers 错误处理

// development error handler 开发时的错误处理
// will print stacktrace 将打印堆栈信息
//var env = process.env.NODE_ENV || 'development';
// this.set('env', env);
if (app.get('env') === 'development') {
  //有四个参数的中间件是错误处理中间件
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);//设置状态码
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler 生产环境错误处理
// no stacktraces leaked to user 不向用户泄露任何推栈信息
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}//隐藏真正的error对象
  });
});


module.exports = app;
