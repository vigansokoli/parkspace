// const jwt = require("jsonwebtoken");
const Spot = require("../models/Spot");
// const { loginValidation } = require("./validation");
// const { tokenSecret } = require("../config");
// const s3Service = require('../services/s3.service');

exports.list = async (req, res) => {
    console.log("shit happening here");
  const spots = await Spot.find();
  res.status(200).send({
    spots: spots.map(spot => spot.toJSON()),
  });
};

exports.find = async (req, res) => {
        Spot.findOne({_id: req.sector}).then(req,res)=>{
            console.log(res);
        });
}