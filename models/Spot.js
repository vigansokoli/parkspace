var mongoose = require("mongoose");
const { Schema } = mongoose;
var {price} = require("../config")

const SpotSchema = new Schema({
    sector: {type:Number, required: true, unique:true},
    name: {type:String, required: true},
    location: {
        lat: {type: Number, required:true},
        long: {type: Number, required:true}
    },
    spaces: Number,
    available: Number,
    isDeleted: {type: Boolean, default:false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startTime: { 
        hours: {type:Number ,required:true},
        minutes:{type:Number ,required:true},
       },
       endTime: { 
    hours: {type:Number ,required:true},
    minutes:{type:Number ,required:true},
    },
    maxDuration: { 
      hours: {type:Number ,required:true},
      minutes:{type:Number ,required:true},
     },
    pricePerHour: {type:Number, required:true,default: price}
}, { timestamps: true });

SpotSchema.path('sector').validate(function (sector) {
  // var licenceRegex = /^[a-z]{3}-?[0-9]{4}$/g;
  // return licenceRegex.test(licence); // Assuming email has a text attribute
  return ("" + sector).length == 5;
}, 'The sector has to be 5 of length');

SpotSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('Sector must be unique'));
    } else {
      next(error);
    }
  });

// YYYY-mm-dd THH:MM:ss
//  date/time format
// or milliseconds 

module.exports = mongoose.model("Spot", SpotSchema);