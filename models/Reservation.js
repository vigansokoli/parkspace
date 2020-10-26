import mongoose from 'mongoose';
const { Schema } = mongoose;
var dayjs = require('dayjs');

const parkingPricePerHour = 1.7;

var ReservationSchema = new Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      car: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
      licencePlate: String,
      location: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
      duration: {type: Date},
      phone: {type: Number},
      fullDay: {type: Boolean, default: false},
    },
    { timestamps: true }
  );

  /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  
  ReservationSchema.path('licencePlate').validate(function (licence) {
  var licenceRegex = /^[a-z]{3}-?[0-9]{4}$/;
  return licenceRegex.test(licence.text); // Assuming email has a text attribute
}, 'The licence field has to be three letters, three numbers ex: (aaa-000, aaa000)')

module.exports = mongoose.model("Reservation", ReservationSchema);