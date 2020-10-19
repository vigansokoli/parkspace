import mongoose from 'mongoose';
const { Schema } = mongoose;

const CarSchema = new Schema({
    sector: {type:Number, required: true},
    maxDuration: Number, // String is shorthand for {type: String}
    location: {
        lat: Number,
        long: Number
    },
    spaces: Number,
    available: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startTime: {type: String, required:true},
    endTime:  {type: String, required:true},
});

CarSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email.text); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')