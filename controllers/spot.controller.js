const Spot = require("../models/Spot");
var dayjs = require('dayjs');

exports.list = async (req, res) => {
  const spots = await Spot.find({ isDeleted: false }).then(spots => {
    res.status(200).json({ spots });
  }).catch(err => {
    res.status(422).send({ error: err });
  });
};

exports.new = async (req, res) => {
  var parameters = req.body;

  var newSpot = new Spot(parameters);
  var startTime = parameters.startTime.hours * 60 + parameters.startTime.minutes;
  var endTime = parameters.endTime.hours * 60 + parameters.endTime.minutes;

  var durationMinutes = endTime - startTime;

  if (parameters.maxDuration)
    newSpot.maxDuration = parameters.maxDuration;
  else
    newSpot.maxDuration = {
      hours: Math.floor(durationMinutes / 60),
      minutes: durationMinutes % 60
    }

  await newSpot.save().then(spot => {
    res.json({ spot });
  }).catch(err => {
    console.log(err);
    return res.status(422).json({ error: err.toString() });
  })
};

exports.find = async (req, res) => {
  await Spot.findOne({ id: req.params.id }).then(spot => {
    console.log({ spot });
    res.json({ spot });
  }).catch(error => {
    res.status(422).send({error});
  });
};

exports.updateAll = async (req, res) => {
  await Spot.updateMany(null, {
    endTime: {
      hours: 21,
      minutes: 0
    },
  }).then(spot => {
    console.log("pizza");
    console.log({ spot });
    res.json({ spot });
  }).catch(error => {
    res.status(422).send({error});
  });
}

exports.get = async (req, res) => {
  await Spot.findById(req.body.id).then(spot => {
    res.json({ spot });
  }).catch(error => {
    res.status(422).send({ error });
  })
}

exports.delete = async (req, res) => {
  await Spot.findByIdAndRemove(req.params.id).then(spot => {
    res.json({ spot });
  }).catch(err => {
    return res.status(422).json({ error: { message: err.message } });
  })
}

exports.update = async (req, res) => {
  var id = req.body.id;
  console.log()
  await Spot.updateOne({ _id: id }, req.body).then(spot => {
    res.json({ spot });
  }).catch(err => {
    return res.status(422).json({ error: err });
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
      return res.status(422).json({ error: err });
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

