// import mongoose from 'mongoose';
var mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");

const UserSchema = new Schema({
  username: {type: String, required:[true, "Username can't be blank"]}, // String is shorthand for {type: String}
  loginID: {type:String},
  email: {type: String, required: [true, "Email can't be blank"], unique: [true, "Email must be unique!"]},
  // credentials: {},
  phone: {type: Number},
  // date: { type: Date, default: Date.now },
  city: String,
  balance: {type: Number,default: 40.00},
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
    username: this.username,
    token: token,
    phone: this.phone,
    city: this.city,
    country: this.country,
    street: this.street,
    balance: this.balance,
    postalCode: this.postalCode
  };
};

UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Email must be unique'));
  } else {
    next(error);
  }
});

// UserSchema.path('email').validate(function (email) {
//     var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//     return emailRegex.test(email.text); // Assuming emai5fc4f1e133188b337296579c
 module.exports = mongoose.model("User", UserSchema);