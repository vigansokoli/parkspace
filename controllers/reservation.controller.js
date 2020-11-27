const Reservation = require("../models/Reservation");
const Spot = require("../models/Spot");
const User = require("../models/User");
var { price } = require("../config");
var schedule = require("node-schedule");
const { unsubscribe } = require("../routes/users");
// const firebase = require("../firebase");

exports.list = async (req, res) => {
    const reservations = await Reservation.find();
    res.status(200).send({
        reservations: reservations.map(resrvation => resrvation.toJSON()),
    });
};

exports.active = async (req, res) => {
    var userId = req.user._id;
    console.log(userId);
    Reservation.find({user: userId, hasEnded:false}).populate("spot").then(reservations=>{
        res.json({reservations});
    }).catch(error=>{
        res.status(500).json({error});
    })
};


exports.history = async (req, res) => {
    var userId = req.user.id;
    console.log(userId);
    Reservation.find({user: userId}).populate("spot").then(reservations=>{
        res.json({reservations});
    }).catch(error=>{
        res.status(500).json({error});
    })
};

exports.new = (req, res, next) => {
    var parameters = req.body;

    console.log(parameters);
    var spotId = req.body.spot;
    var userId = req.user;
    var spot, user;

    console.log("the spot id is " + spotId);

    if (userId) {
        Spot.findById(spotId).then(spotFound =>{
                console.log(spotId);

                if(!spotFound)
                    return Promise.reject(new Error("The spot doesn't exist"));

                spot = spotFound;
                return User.findById(userId);

        }).then(user => {
            var reservation = new Reservation();
            reservation.spot = spot;
            var startTime, endTime;
            // if (!req.body.fullDay) {
            //     reservation.duration = req.body.duration;
            // } else {
                
            // }
            if(req.body.fullDay)
                reservation.fullDay = true;

            reservation.duration = req.body.duration;

            startTime = new Date(Date.now());
            endTime = new Date(Date.now());
            endTime.setMinutes(endTime.getMinutes() + reservation.duration.minutes);
            endTime.setHours(endTime.getHours() + reservation.duration.hours);

            console.log(startTime);
            console.log(endTime);

            reservation.startTime = startTime;
            reservation.endTime = endTime;
            reservation.user = user.id;
            reservation.licencePlate = req.body.licencePlate;

            return reservation.save();

        }).then(savedReservation => {

            var dateStarted = new Date(savedReservation.createdAt);
            dateStarted.setHours(dateStarted.getHours() + savedReservation.duration.hours);
            dateStarted.setMinutes(dateStarted.getMinutes() + savedReservation.duration.minutes);
            console.log("the saved reservation is");

            res.json(savedReservation);
            console.log(savedReservation);
            var stringifed = JSON.stringify(savedReservation);
            var scheduling = schedule.scheduleJob(stringifed, dateStarted, function() {
                
                savedReservation = JSON.parse(stringifed);
                var expenses =0;

                var totalDuration = savedReservation.duration.hours + savedReservation.duration.minutes/60;
                console.log(totalDuration);
                expenses = parseFloat((totalDuration * price).toFixed(2));
                console.log(expenses)

                Reservation.update({ id: savedReservation.id }, { hasEnded: true , cost: expenses}).then(updatedFields => {
                    return User.findById(savedReservation.user);
                }).then(payingUser=> {
                    payingUser.balance = payingUser.balance - expenses;                    
                    return payingUser.save();
                }).then(result=>{
                    // firebase.sendRemoteNotification("Parking has ended" ,save.username);
                    console.log(result);
                }).catch(err=>{
                    console.log(err);
                })
            })
        }).catch(error => {
            if(error.message)
                error = error.message;

            console.log(error);
            res.status(400).json({error});
        });

    } else {
        
    }

};

exports.end = async (req, res) => {

    var userId = req.user;
    var expenses = 0;

    Reservation.findById(req.body.id).then(reservation => {

        if(reservation.hasEnded)
            throw new Error("The reservation had ended");

        var startTime = reservation.createdAt;
        startTime = new Date(reservation.createdAt);
        var startTimeSeconds = startTime.getHours() + startTime.getMinutes() / 60;

        var endTime = new Date();
        var endTimeSeconds = endTime.getHours() + endTime.getMinutes() / 60;

        var totalDuration = endTimeSeconds - startTimeSeconds;
        expenses = parseFloat((totalDuration * price).toFixed(2));


        var duration = {};
        duration.hours = endTime.getHours() - startTime.getHours();
        duration.minutes = endTime.getMinutes() - startTime.getMinutes();

        reservation.cost = expenses;
        reservation.duration = duration;
        reservation.hasEnded = true;
        return reservation.save();
    }).then(done =>{
        return User.findById(done.user);
    }).then(payingUser=> {
        payingUser.balance = payingUser.balance - expenses;
        return payingUser.save();
    }).then(result=>{
        // firebase.sendRemoteNotification("Parking has ended" ,result.username);
        res.json({ expenses: expenses });
    }).catch(error=>{
        res.status(422).json({error: error.message});
    })
}