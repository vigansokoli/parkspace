const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
// const config = require


// passport.serializeUser((user, done) => {
//     done(null, user.id);
// })

// passport.deserializeUser((id, done) => {
//     User.findById(id).then(user => {
//         if (user) {
//             done(null, user.id);
//         }
//     })
// });

passport.use("login", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
},
    async (email, password, done) => {
        await User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.validatePassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));


passport.use("register", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
},
    async (email, password, done) => {

        console.log("register");
        var user = new User();

        user.email = email;
        user.password = password;
        user.setPassword(password);
        user.save().then(finalUser=>{
            return done(null, finalUser);
        }).catch(err => {
            console.log(err);
            return done(err, null);
        });
        // Send the user information to the next middleware

    }
));