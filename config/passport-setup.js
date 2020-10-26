const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { google } = require("../config");
const { deleteOne } = require("../models/User");
const User = require("../models/User");
// const config = require


passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser((id, done)=>{
    User.findById(id).then(user=>{
        if(user){
            done(null, user.id);
        }
    })
});

passport.use(
    new GoogleStrategy({
        clientID: google.clientID,
        clientSecret: google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({loginID: profile.id}).then(currentUser=>{
            if(!currentUser){
                new User({
                    name: profile.displayName,
                    loginID: profile.id,
                    email: profile.emails[0].value
                }).save().then((newUser) =>{
                    console.log("New User created");
                    console.log(newUser);
                    done(null, newUser);
                });
            }else   
                done(null, currentUser);
        }).catch(err=>{
            done(err, null);
        });
        // possiblity of updating and creating at the same space
        // User.findOneAndUpdate({ loginID: profile.id }, profile, {upsert:true}, function (err, user) {
        //     console.log(user);
        //     console.log(err);
        //     return cb(err, user);
        // });
    })
);