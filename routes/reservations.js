var express = require('express');
var router = express.Router();
var reservationController = require("../../controller/reservation.controller.js");

router.get('/', reservationController.list);

router.post('/new', reservationController.new);

router.delete('/delete/:id', reservationController.delete);

router.post('/get', reservationController.get);

router.put('/update', reservationController.update);

module.exports = router;

