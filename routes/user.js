var express = require('express');
//生成一个路由实例
var router = express.Router();


//注册
router.get('/reg', function(req, res, next) {
  res.render('user/reg');
});
//登陆
router.get('/login', function(req, res, next) {
  res.render('user/login');
});
//退出
router.get('/logout', function(req, res, next) {
  res.send('退出');
});

module.exports = router;
