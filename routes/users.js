var express = require('express');
var router = express.Router();
var userController = require("../controllers/user.controller");

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/', userController.list);

router.post("/login", userController.login);

router.post("/update", verifyToken, userController.user_update_notification);

// router.post("/clean", verifyToken, userController.user_post_clean);

// router.post("/upgrade", verifyToken, userController.user_post_upgrade);


module.exports = router;
