// import mongoose from 'mongoose';
var mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  loginID: {type:String, required:[true, "can't be blank"]},
  email: {type: String, required: [true, "can't be blank"]},
  // credentials: {},
  phone: {type: Number},
  // date: { type: Date, default: Date.now },
  city: String,
  country: String,
  street: String, 
  postalCode: Number
});


UserSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email.text); // Assuming email has a text attribute
 }, 'The e-mail field cannot be empty.')


 module.exports = mongoose.model("User", UserSchema);