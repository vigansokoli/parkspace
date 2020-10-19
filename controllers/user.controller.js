// const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const { loginValidation } = require("./validation");
// const { tokenSecret } = require("../config");
// const s3Service = require('../services/s3.service');

exports.list = async (req, res) => {
    console.log("shit happening here");
  const users = await User.find();
  res.status(200).send({
    players: users.map(user => user.toJSON()),
  });
};

exports.login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    console.log(error);
  return res
      .status(422)
      .send({ error: { message: error.details[0].message } });
  }

  try {
    let user = await User.findOne({ deviceID: req.body.deviceID });
    if (!user) {
      user = new User();
    }

    const avatar = req.file;
    if (!avatar && !user.avatarUrl) {
    return res.status(422).json({ errors: { message: 'avatar can\'t be blank' } });
    }

    if (avatar) {
      const avatarData = await s3Service.upload(avatar, user._id);
      user.avatarUrl = avatarData.Key;
    }

    user.username = req.body.username;
    user.deviceID = req.body.deviceID;

    try {
      const newUser = await user.save();
      const token = jwt.sign({ _id: user._id }, tokenSecret);
      res
        .header("authorization", token)
        .status(200)
        .send({ authorization: token, player: newUser.toJSON() });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: { user: err.message } });
  }
};

// exports.user_update_notification = function (req, res) {
//   var userId = req.user._id;

//   if (!req.body.token) {
//     return res
//       .status(422)
//       .json({ errors: { message: "token can't be blank" } });
//   }

//   User.findById(userId, function (err, user) {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ errors: { user: err } });
//     }
//     if (!user) {
//       var msg = "user with id (" + userId + ") not found";
//       return res.status(500).json({ errors: { user: msg } });
//     }
//     user.notificationToken = req.body.token;
//     user.save(function (err) {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({ errors: { user: err } });
//       } else {
//         return res.json({ success: true });
//       }
//     });
//   });
// };