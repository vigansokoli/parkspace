var express = require('express');
var router = express.Router();
var reservationController = require("../controllers/reservation.controller");
var passport = require("passport");

router.get('/', passport.authenticate("jwt"),reservationController.list);

router.post('/new', passport.authenticate("jwt"), reservationController.new);

router.post('/end', passport.authenticate("jwt"), reservationController.end);
// router.delete('/delete/:id', reservationController.delete);

// router.post('/get', reservationController.get);

// router.put('/update', reservationController.update);

module.exports = router;