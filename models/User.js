// import mongoose from 'mongoose';
var mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");

const UserSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  loginID: {type:String},
  email: {type: String, required: [true, "can't be blank"]},
  // credentials: {},
  phone: {type: Number},
  // date: { type: Date, default: Date.now },
  city: String,
  country: String,
  street: String, 
  postalCode: Number,
  password: String,
  salt: String
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.password === hash;
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

UserSchema.methods.toAuthJSON = function(token) {
  return {
    _id: this._id,
    email: this.email,
    token: token,
    phone: this.phone,
    city: this.city,
    country: this.country,
    street: this.street,
    postalCode: this.postalCode
  };
};

// UserSchema.path('email').validate(function (email) {
//     var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//     return emailRegex.test(email.text); // Assuming email has a text attribute
//  }, 'The e-mail field cannot be empty.')


 module.exports = mongoose.model("User", UserSchema);