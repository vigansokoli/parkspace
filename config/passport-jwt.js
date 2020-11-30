const passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../models/User");
var {secret} = require("../config");

const sendError = (err, res) => res.status(400).json({ error: err.message });

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

module.exports =  (req, res, next) => {
    // const { email, password } = req.body;
 
    // // if email or password are missing, send an error back to the client
    // if (!email || !password) return sendError(badCredentials, res);

    passport.authenticate("jwt", (err, user, info) => {
        // if an error was returned by the strategy, send it to the client
        if (err) return sendError(err, res);
        console.log(user);
        if (!user) return sendError(info, res);
        // manually setting the logged in user to req.user 
        // optionally, you can set it to "req.session" if you're using some sort of session
        req.user = user;

        // invoking "next" to continue to the controller
        next();
    })(req, res, next);
};