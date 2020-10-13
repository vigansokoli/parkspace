import mongoose from 'mongoose';
const { Schema } = mongoose;


var LocationSchema = new Schema(
    {
        location: {
            lat: Number,
            long: Number
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model("Location", LocationSchema);