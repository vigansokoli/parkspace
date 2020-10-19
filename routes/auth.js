var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/google', function(req, res, next) {
    res.render('index', { title: 'Google Login' });
  });

router.get('/facebook', function(req, res, next) {
    res.render('index', { title: 'Facebook Login' });
  });  


  router.get('/logout', function(req, res, next) {
    res.render('index', { title: 'Logout' });
  });  

module.exports = router;
