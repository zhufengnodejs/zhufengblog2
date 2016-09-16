var express = require('express');
var util = require('../util');
var middleware = require('../middleware');
//生成一个路由实例
var router = express.Router();

//注册
router.get('/reg',middleware.checkNotLogin, function(req, res, next) {
  res.render('user/reg');
});
//提交注册表单
router.post('/reg',middleware.checkNotLogin,function(req,res,next){
  var user = req.body;
  if(user.password != user.repassword){
    req.flash('error','密码和重复不一致');
    return res.redirect('back');
  }
  //加密密码
  user.password = util.md5(user.password);
  //给头像赋值
  user.avatar = 'https://secure.gravatar.com/avatar/'+util.md5(user.email)+'?s=28';
  Model('User').create(user).then(function(data){
    //res.send(data);
    req.session.user = data;
    req.flash('success','注册成功');
    res.redirect('/');
  }).catch(function(err){
    req.flash('error','服务器端错误');
    res.status(500).send('服务器端错误');
  })
});
//登陆
router.get('/login',middleware.checkNotLogin, function(req, res, next) {
  res.render('user/login');
});
router.post('/login',middleware.checkNotLogin, function(req, res, next) {
  var user = req.body;
  user.password = util.md5(user.password);
  Model('User').findOne(user).then(function(user){
    if(user){
      req.session.user = user;
      req.flash('success','登录成功');
      res.redirect('/');
    }else{
      req.flash('error','用户名或密码错误');
      res.redirect('back');
    }
  }).catch(function(err){
    req.flash('error','服务器端错误');
    res.status(500).send('服务器端错误');
  })
});
//退出
router.get('/logout',middleware.checkLogin, function(req, res, next) {
  req.session.user = null;
  res.redirect('/user/login');
});

module.exports = router;
