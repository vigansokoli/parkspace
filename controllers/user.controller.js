const User = require("../models/User");

exports.list = async (req, res) => {
  const users = await User.find();
  res.status(200).send({
    players: users.map(user => user.toJSON()),
  });
};

exports.list = async (req, res) => {
  const users = await User.find();
  res.status(200).send({
    players: users.map(user => user.toJSON()),
  });
};

exports.update = function (req, res, next) {

  var id = req.body.id;
  var newUserFields = {};

  User.updateOne({ _id: id }, newUserFields).then(user => {
    res.json(user);
  }).catch(err => {
    return res.status(422).json({ errors: err });
  })
}

exports.profile = function(req,res,next){
  User.findById(req.body.id).then(user => {
    res.json(user);
  }).catch(err => {
    res.status(422).send(err.message);
  })
}

exports.delete = function (req, res, next) {
  User.findByIdAndRemove(req.params.id).then(user => {
    res.json(user);
  }).catch(err => {
    return res.status(422).json({ errors: { message: err.message } });
  })
}