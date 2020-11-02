var express = require('express');
var router = express.Router();
var reservationController = require("../controllers/reservation.controller");
var verifyAuth = require('./authentication');

router.get('/', reservationController.list);

router.post('/new', reservationController.new);

router.post('/end', reservationController.end);
// router.delete('/delete/:id', reservationController.delete);

// router.post('/get', reservationController.get);

// router.put('/update', reservationController.update);

module.exports = router;