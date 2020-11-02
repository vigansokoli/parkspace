const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { google } = require("../config");
const { deleteOne } = require("../models/User");
const User = require("../models/User");
// const config = require


// passport.serializeUser((user, done)=>{
//     done(null, user.id);
// })

// passport.deserializeUser((id, done)=>{
//     User.findById(id).then(user=>{
//         if(user){
//             done(null, user.id);
//         }
//     })
// });

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd',
    session: false
},
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));