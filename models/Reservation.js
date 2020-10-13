import mongoose from 'mongoose';
const { Schema } = mongoose;

const parkingPricePerHour = 1.7;

var ReservationSchema = new Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      car: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
      location: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
      duration: {type: Date},
      phone: {type: Number},
      fullDay: {type: Boolean, default: false},
    },
    { timestamps: true }
  );
  

  module.exports = mongoose.model("Reservation", ReservationSchema);