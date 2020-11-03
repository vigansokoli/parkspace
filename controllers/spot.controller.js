const Spot = require("../models/Spot");
var dayjs = require('dayjs');

exports.list = async (req, res) => {
  const spots = await Spot.find({isDeleted:false}).then(spots=>{
    res.status(200).json(spots);
  }).catch(err=>{
    res.status(422).send({ errors: err });
  });
};

exports.new = async (req, res) => {
  var parameters  = req.body;

  var newSpot = new Spot(parameters);

  await newSpot.save().then(spot=>{
    res.json(spot);
  }).catch(err => {
    console.log(err);
    return res.status(422).json(err);
  })
};

exports.find = async (req, res) => {
  await Spot.findOne({ id: req.params.id }).then(spot => {
    console.log(spot);
  });
};

exports.get = async (req, res) => {
  await Spot.findById(req.body.id).then(spot => {
    res.json(spot);
  }).catch(err => {
    res.status(422).send(err.message);
  })
}

exports.delete = async (req, res) => {
  await Spot.findByIdAndRemove(req.params.id).then(spot => {
    res.json(spot);
  }).catch(err => {
    return res.status(422).json({ errors: { message: err.message } });
  })
}

exports.update = async (req, res) =>  {

  var id = req.body.id;

  await Spot.updateOne({ _id: id }, req.body).then(spot => {
    res.json(spot);
  }).catch(err => {
    return res.status(422).json({ errors: err });
  })
}

exports.delete = function (req, res) {
  console.log("im am here");
  Spot.updateMany({ _id: req.params.id }, { isDeleted: true })
    .then(result => {
      console.log(result);
      res.json(result);
    })
    .catch(err => {
      return res.status(422).json({ errors: { message: err.message } });
    });
};

  // exports.word_delete_all = function (req, res, next) {
  //   Spot.updateMany({}, { isDeleted: true }, { multi: true })
  //     .then(result => {
  //       res.json(result);
  //     })
  //     .catch(err => {
  //       return res.status(422).json({ errors: { message: err.message } });
  //     });
  // };

