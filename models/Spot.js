import mongoose from 'mongoose';
const { Schema } = mongoose;

const CarSchema = new Schema({
    maxDuration: Number, // String is shorthand for {type: String}
    location: {
        lat: Number,
        long: Number
    },
    spaces: Number,
    available: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

CarSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email.text); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')