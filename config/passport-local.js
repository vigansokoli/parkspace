const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");


const sendError = (err, res) => res.status(400).json({ err: err.toString() });

const badCredentials = "There was a problem with your login credentials. Please make sure your username and password are correct.";

passport.use("login", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
},
    async (email, password, done) => {
        await User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err, false); }
            if (!user) { return done(badCredentials, false); }
            if (!user.validatePassword(password)) { return done("Invalid Password", false); }
            return done(null, user);
        });
    }
));


passport.use("register", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
},
    async (email, password, done) => {
        var user = new User();

        user.email = email;
        user.password = password;
        user.setPassword(password);
        user.save().then(finalUser => {
            return done(null, finalUser);
        }).catch(err => {
            console.log(err);
            return done(err, false);
        });
        // Send the user information to the next middleware

    }
));


// exporting a wrapper function that will invoke the passport.authenticate method
module.exports = {
    login: (req, res, next) => {
        const { email, password } = req.body;

        // if email or password are missing, send an error back to the client
        if (!email || !password) return sendError(badCredentials, res);

        passport.authenticate("login", (err, user) => {
            // if an error was returned by the strategy, send it to the client
            if (err) return sendError(err, res);

            // manually setting the logged in user to req.user 
            // optionally, you can set it to "req.session" if you're using some sort of session
            req.user = user;

            // invoking "next" to continue to the controller
            next();
        })(req, res, next);
    },
    register: (req, res, next) => {
        const { email, password } = req.body;

        // if email or password are missing, send an error back to the client
        if (!email || !password) return sendError(badCredentials, res);

        passport.authenticate("register", (err, user) => {
            // if an error was returned by the strategy, send it to the client
            if (err) return sendError(err, res);
            
            // manually setting the logged in user to req.user 
            // optionally, you can set it to "req.session" if you're using some sort of session
            req.user = user;

            // invoking "next" to continue to the controller
            next();
        })(req, res, next);
    }
}