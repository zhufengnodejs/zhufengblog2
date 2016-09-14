var express = require('express');
var router = express.Router();

/* GET home page. */
/*获得主页*/
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
});

module.exports = router;
