var express = require('express');
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shitspress' });
});

// router.get('/google', passport.authenticate("google", {
//   scope: ['profile']
// }));

// router.get('/google/auth/redirect', passport.authenticate("google", {
//   scope: ['profile']
// }));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.llll
   res.send(req.user);
    // res.redirect('/');
  });

router.get('/facebook', function(req, res, next) {
    res.render('index', { title: 'Facebook Login' });
  });  


router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect("/users");
  // res.render('index', { title: 'Logout' });
});  


module.exports = router;
