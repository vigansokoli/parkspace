const passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../models/User");
var {secret} = require("../config");

// This verifies that the token sent by the user is valid
passport.use(
    new JwtStrategy(
        {
            secretOrKey: secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        // eslint-disable-next-line consistent-return
        async (token, done) => {
            try {
                // Find the user associated with the email provided by the user
                const user = await User.findById(token._id);

                if (!user) {
                    // If the user isn't found in the database, return a message
                    return done(null, false, { message: 'User not found' });
                }
                
                // Send the user information to the next middleware
                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                console.log(error);
                done(error);
            }
        }
    )
);