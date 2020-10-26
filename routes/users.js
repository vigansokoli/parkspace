var express = require('express');
var router = express.Router();
var userController = require("../controllers/user.controller");
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/', userController.list);

// router.post("/login", userController.login);

router.post('/profile', userController.profile);

router.put("/update", userController.update);

router.delete('/delete/:id', userController.delete);

module.exports = router;
