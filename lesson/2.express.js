var express = require('express');
var app = express();
app.use(function(req,res,next){
    console.log(1,req.url);
    //如果next里有参数，则会跳过正常的中间件直接执行错误处理中间件
    //如果next没有参数，则跳过错误处理中间件
    next('err1');
});
app.use(function(req,res,next){
    console.log(2);
    next();
});
app.use(function(err,req,res,next){
    console.log('err');
    next();
});
app.get('/',function(req,res){
    res.send('主页');
});
app.listen(9099);