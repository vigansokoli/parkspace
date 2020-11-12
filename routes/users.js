var express = require('express');
var router = express.Router();
var userController = require("../controllers/user.controller");
var passport = require('passport');
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/', userController.list);

router.post("/login", passport.authenticate('login'), userController.login);

router.post("/register", passport.authenticate('register'), userController.register);

router.get('/profile', passport.authenticate("jwt"), userController.profile);

router.put("/update",passport.authenticate("jwt"), userController.update);

router.delete('/delete/:id', passport.authenticate("jwt"), userController.delete);

module.exports = router;
