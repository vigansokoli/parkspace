var express = require('express');
var router = express.Router();
var spotController = require("../controllers/spot.controller");
var passport = require("passport");

router.get('/', passport.authenticate("jwt"), spotController.list);

router.post('/new', passport.authenticate("jwt"), spotController.new);

router.delete('/delete/:id', passport.authenticate("jwt"), spotController.delete);

router.post('/get', passport.authenticate("jwt"), spotController.get);

router.put('/update', passport.authenticate("jwt"), spotController.update);

module.exports = router;

