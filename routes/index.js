var express = require('express');
var router = express.Router();
var verifyAuth = require('./authentication');

/* GET home page. */
router.get('/', verifyAuth, function(req, res, next) {
  console.log("im ah erer");
  res.render('index', { title: 'Express' });
});

module.exports = router;
