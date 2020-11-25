var express = require('express');
var router = express.Router();
var userController = require("../controllers/user.controller");
// var passport = require('passport');
var {login, register} = require("../config/passport-local");
var jwtAuth = require("../config/passport-jwt");
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/', userController.list);

router.post("/login", login, userController.login);

router.post("/register", register, userController.register);

router.get('/profile', jwtAuth, userController.profile);

router.put("/update",jwtAuth, userController.update);

router.delete('/delete/:id', jwtAuth, userController.delete);

module.exports = router;
