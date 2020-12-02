const User = require("../models/User");
const {secret} = require("../config");
const jwt = require("jsonwebtoken");
const { rescheduleJob } = require("node-schedule");

exports.list = async (req, res) => {
  const users = await User.find();
  res.status(200).send({
    players: users.map(user => user.toJSON()),
  })
};

exports.login = async (req, res) => {
  if(req.err){
    console.log(err);
    return res.json({error:err});
  }
  const user = req.user;
  const token = jwt.sign({ _id: user._id }, secret);
  res
    .header("authorization", token)
    .status(200)
    .send(user.toAuthJSON(token));
};

exports.register = async (req, res) => {

  if(req.err){
    return res.json({error: err});
  }
  const user = req.user;
  const token = jwt.sign({ _id: user._id }, secret);
  res
    .header("authorization", token)
    .status(200)
    .send(user.toAuthJSON(token));
};

exports.resetPassword = function (req, res, next) {
  // var user = req.user;
  // // var id = req.user._id;
  // var newUserFields = req.body;

  // var newPassword = newUserFields.newPassword;
  // var oldPassword =newUserFields.oldPassword;

  // if(user.validatePassword(oldPassword)){
  //   user.setPassword(newPassword);
  // }

  // user.save().then(user=>{
  //   res.json(user);
  // }).catch(error=>{
  //   res.status(500).json(error);
  // })

  res.render('resetPass', { title: 'Password Reset' });
  // res.render('index', { title: 'Express' });
}

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

exports.profile = function(req,res,next){
  var id = req.user._id;

  User.findById(id).then(user => {
    res.json(user.toAuthJSON());
  }).catch(error => {
    res.status(422).send({error});
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