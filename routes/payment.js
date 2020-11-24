var express = require('express');
var router = express.Router();
var reservationController = require("../controllers/reservation.controller");
var passport = require("passport");
var paypal = require("paypal.js");

router.post('/checkout', passport.authenticate("jwt"),reservationController.list);

// router.post('/new', passport.authenticate("jwt"), reservationController.new);
// 1
// router.post('/end', passport.authenticate("jwt"), reservationController.end);
// router.delete('/delete/:id', reservationController.delete);

// router.post('/get', reservationController.get);

// router.put('/update', reservationController.update);

module.exports = router;