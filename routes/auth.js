var express = require('express');
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/google', passport.authenticate("google", {
  scope: ['profile']
}));

router.get('/facebook', function(req, res, next) {
    res.render('index', { title: 'Facebook Login' });
  });  


  router.get('/logout', function(req, res, next) {
    res.render('index', { title: 'Logout' });
  });  

module.exports = router;
