var express = require('express');
var router = express.Router();
var spotController = require("../controllers/spot.controller");

router.get('/', spotController.list);

router.post('/new', spotController.new);

router.delete('/delete/:id', spotController.delete);

router.post('/get', spotController.get);

router.put('/update', spotController.update);

module.exports = router;

