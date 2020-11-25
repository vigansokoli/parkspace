var express = require('express');
var router = express.Router();
var spotController = require("../controllers/spot.controller");
var jwtAuth = require("../config/passport-jwt");

router.get('/',jwtAuth, spotController.list);

router.post('/new',jwtAuth, spotController.new);

router.delete('/delete/:id',jwtAuth, spotController.delete);

router.post('/get',jwtAuth, spotController.get);

router.put('/update',jwtAuth, spotController.update);

module.exports = router;

