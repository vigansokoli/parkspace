var express = require('express');
var router = express.Router();
var reservation_controller = require("../../controller/reservation.controller.js");

router.post('/', verifyToken, reservation_controller.list);

router.post('/new', verifyToken, reservation_controller.create);

router.post('/start', [verifyToken, middleware.checkGame], reservation_controller.start);

router.post('/restart', [verifyToken, middleware.checkGame], reservation_controller.restart);

router.post('/history', verifyToken, reservation_controller.history);

module.exports = router;

