var express = require('express');
var router = express.Router();
var reservationController = require("../controllers/reservation.controller");
var jwtAuth = require("../config/passport-jwt");

router.get('/',jwtAuth,reservationController.list);

router.post('/new',jwtAuth, reservationController.new);

router.post('/end',jwtAuth, reservationController.end);
// router.delete('/delete/:id', reservationController.delete);

router.get('/active', jwtAuth,reservationController.active);

router.get('/history', jwtAuth,reservationController.history);

// router.put('/update', reservationController.update);

module.exports = router;