var mongoose = require("mongoose");
const { Schema } = mongoose;
var dayjs = require('dayjs');

const parkingPricePerHour = 1.7;

var ReservationSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true },
    // car: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
    licencePlate: { type: String, required: true },
    spot: { type: mongoose.Schema.Types.ObjectId, ref: "Spot", required:true },
    duration: { 
      hours: {type:Number ,required:true},
      minutes:{type:Number ,required:true},
     },
     startTime: Date,
     endTime: Date,
     hasEnded: {type: Boolean, required:true, default: false},
    fullDay: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReservationSchema.path('licencePlate').validate(function (licence) {
  var licenceRegex = /^[a-z]{3}-?[0-9]{4}$/g;
  return licenceRegex.test(licence); // Assuming email has a text attribute
}, 'The licence field has to be three letters, three numbers ex: (aaa-000, aaa000)')


module.exports = mongoose.model("Reservation", ReservationSchema);