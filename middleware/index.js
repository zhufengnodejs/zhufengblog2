//此中间件要求此路由需要登陆后才能访问
exports.checkLogin = function(req,res,next){
   if(req.session.user){
       next();
   }else{
       res.redirect('/user/login');
   }
}
//要求没有登陆的用户才能继续访问
exports.checkNotLogin = function(req,res,next){
    if(req.session.user){
        res.redirect('/');
    }else{
        next();
    }
}