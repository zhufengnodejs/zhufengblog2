var express = require('express');
var router = express.Router();
router.get('/post',function(req,res){
  res.render('article/post');
});
module.exports = router;