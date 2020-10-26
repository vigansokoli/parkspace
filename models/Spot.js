var mongoose = require("mongoose");
const { Schema } = mongoose;

const SpotSchema = new Schema({
    sector: {type:Number, required: true},
    maxDuration: Number, // String is shorthand for {type: String}
    location: {
        lat: {type: Number, required:true},
        long: {type: Number, required:true}
    },
    spaces: Number,
    available: Number,
    isDeleted: {type: Boolean, default:false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startTime: {type: Date, required:true},
    endTime:  {type: Date, required:true}

}, { timestamps: true });


// YYYY-mm-dd THH:MM:ss
//  date/time format
// or milliseconds 

module.exports = mongoose.model("Spot", SpotSchema);