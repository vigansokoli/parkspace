const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth");
const { clientID, clientSecret } = require("../config");
// const config = require

passport.use(
    new GoogleStrategy({
        //options for the google strategy
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: '/auth/google/redirect'
        }, (req, res) => {
        //passport callback function
        })
);