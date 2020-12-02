const User = require("../models/User");
const { secret } = require("../config");
const jwt = require("jsonwebtoken");
const { rescheduleJob } = require("node-schedule");
const { mail } = require("../nodemail");
const crypto = require("crypto");
const { machineLearning } = require("firebase-admin");
const { json } = require("express");


exports.list = async (req, res) => {
  const users = await User.find();
  res.status(200).send({
    players: users.map(user => user.toJSON()),
  })
};

exports.login = async (req, res) => {
  if (req.err) {
    console.log(err);
    return res.json({ error: err });
  }
  const user = req.user;
  const token = jwt.sign({ _id: user._id }, secret);
  res
    .header("authorization", token)
    .status(200)
    .send(user.toAuthJSON(token));
};

exports.register = async (req, res) => {

  if (req.err) {
    return res.json({ error: err });
  }
  const user = req.user;
  const token = jwt.sign({ _id: user._id }, secret);
  res
    .header("authorization", token)
    .status(200)
    .send(user.toAuthJSON(token));
};

exports.resetPassword = function (req, res, next) {
  var user = req.user;

  console.log(user);
  var token = crypto.randomBytes(20).toString('hex');

  User.findOne({ email: user.email }).then(user => {
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    return user.save();
  }).then(newUser => {

    var message = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + req.headers.host + '/users/reset/' + newUser.resetPasswordToken + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n';

    mail(newUser, message);
    res.json({ success: true });
  }).catch(error => {
    console.log(error);
    res.json({ error });
  })
}

exports.newPassword = function (req, res, next) {

  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      console.log('error', 'Password reset token is invalid or has expired.');
      return;
      // return res.redirect('back');
    }

    res.render('resetPass', { title: 'Password Reset', error: "Token has expired, try again!" });
  });
}

exports.storePassword = function (req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).then(user => {
    if (!user) {
      console.log('error','Password reset token is invalid or has expired.');
      // req.flash('error', 'Password reset token is invalid or has expired.');
      // return res.redirect('back');
    }
    user.setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    return user.save();
  }).then(updatedUser => {
    console.log(updatedUser.toAuthJSON());
    var message = 'This is a confirmation that the password for your account ' + updatedUser.email + ' has just been changed.\n';
    mail(updatedUser, message);
    res.json({success: updatedUser.toAuthJSON()});
  }).catch(error=>{
    console.log(error)
    res.status(400).cryptojson(error);
  })
};

// async (email, password, done) => {
//   await User.findOne({ email: email }, function (err, user) {
//       if (err) { return done(err, false); }
//       if (!user) { return done(badCredentials, false); }
//       if (!user.validatePassword(password)) { return done("Invalid Password", false); }
//       return done(null, user);
//   });
// }

exports.update = function (req, res, next) {
  var id = req.user._id;
  var newUserFields = req.body;

  User.findByIdAndUpdate(id, newUserFields).then(user => {
    const token = jwt.sign({ _id: id }, secret);
    res.json(user.toAuthJSON(token));
  }).catch(err => {
    return res.status(422).json({ error: err });
  })
}

exports.profile = function (req, res, next) {
  var id = req.user._id;

  User.findById(id).then(user => {
    res.json(user.toAuthJSON());
  }).catch(error => {
    res.status(422).send({ error });
  })
}

exports.delete = function (req, res, next) {
  var id = req.user._id;
  User.findByIdAndRemove(id).then(user => {
    res.json(user);
  }).catch(err => {
    return res.status(422).json({ error: err });
  })
}