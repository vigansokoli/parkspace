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
    Reservation.find({ user: userId, hasEnded: false }).populate("spot").then(reservations => {
        res.json({ reservations });
    }).catch(error => {
        res.status(500).json({ error });
    })
};


exports.history = async (req, res) => {
    var userId = req.user.id;
    console.log(userId);
    Reservation.find({ user: userId }).populate("spot").then(reservations => {
        res.json({ reservations });
    }).catch(error => {
        res.status(500).json({ error });
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
        Spot.findById(spotId).then(spotFound => {

            if (!spotFound)
                return Promise.reject(new Error("The spot doesn't exist"));

            spot = spotFound;
            return User.findById(userId);

        }).then(user => {
            var reservation = new Reservation();
            reservation.spot = spot;
            var startTime, endTime;

            if (req.body.fullDay)
                reservation.fullDay = true;

            reservation.duration = req.body.duration;

            var estimateTime = reservation.duration.hours + reservation.duration.minutes/60;
            var estimatedCost =  (estimateTime * spot.pricePerHour);
            console.log("estimated cost");
            console.log(estimatedCost);

            if(estimatedCost > user.balance)
                Promise.reject(new Error("The balance is insufficient for the transaction"));

            user.balance = (user.balance -estimatedCost).toFixed(2);
            user.save();

            reservation.cost = estimatedCost;

            startTime = new Date(Date.now());
            endTime = new Date(Date.now());
            endTime.setMinutes(endTime.getMinutes() + reservation.duration.minutes);
            endTime.setHours(endTime.getHours() + reservation.duration.hours);

            reservation.startTime = startTime;
            reservation.endTime = endTime;
            reservation.user = user.id;
            reservation.licencePlate = req.body.licencePlate;
            
            return reservation.save();

        }).then(savedReservation => {

            var dateStarted = new Date(savedReservation.createdAt);
            var initialExpense = savedReservation.cost;
            dateStarted.setHours(dateStarted.getHours() + savedReservation.duration.hours);
            dateStarted.setMinutes(dateStarted.getMinutes() + savedReservation.duration.minutes);
            res.json(savedReservation);

            var stringifed = JSON.stringify(savedReservation);
            
            var scheduling = schedule.scheduleJob(stringifed, dateStarted, function () {
                var expenses = 0;
                Reservation.findById(savedReservation._id).then(endingReservation=>{
                    console.log(endingReservation);

                    if(endingReservation.hasEnded)
                        return Promise.reject(new Error("Reservation has already ended"));

                    endingReservation = JSON.parse(stringifed);

    
                    var totalDuration = endingReservation.duration.hours + endingReservation.duration.minutes / 60;
                    
                    if (totalDuration < 1/60)
                    totalDuration = 1/60;
    
                    expenses = (totalDuration * spot.pricePerHour).toFixed(2);
                    console.log(expenses);

                    // endingReservation.hasEnded=true;
                    // endingReservation.cost = expenses;

                    return Reservation.update({_id: endingReservation._id}, {hasEnded:true, cost: expenses});

                }).then(updatedFields => {
                    return User.findById(savedReservation.user);
                }).then(payingUser => {
                    payingUser.balance = (payingUser.balance - expenses + initialExpense).toFixed(2);
                    return payingUser.save();
                }).then(result => {
                    // firebase.sendRemoteNotification("Parking has ended" ,save.username);
                    // console.log(result);
                }).catch(err => {
                    console.log(err);
                })
            })
        }).catch(error => {
            if (error.message)
                error = error.message;

            console.log(error);
            res.status(400).json({ error });
        });
    }
};

exports.end = async (req, res) => {

    var userId = req.user;
    var expenses = 0;
    var initialExpense = 0;

    Reservation.findById(req.body.id).populate("spot").then(reservation => {

        if (reservation.hasEnded)
            throw new Error("The reservation had ended");

        var startTime = reservation.createdAt;
        startTime = new Date(reservation.createdAt);
        var startTimeSeconds = startTime.getHours() + startTime.getMinutes() / 60;

        var endTime = new Date();
        var endTimeSeconds = endTime.getHours() + endTime.getMinutes() / 60;

        var totalDuration = endTimeSeconds - startTimeSeconds;

        if (totalDuration < 1/60)
            totalDuration = 1/60;

        expenses =(totalDuration * reservation.spot.pricePerHour).toFixed(2);

        var duration = {};
        duration.hours = endTime.getHours() - startTime.getHours();
        duration.minutes = endTime.getMinutes() - startTime.getMinutes();

        initialExpense = reservation.cost;
        reservation.cost = expenses;
        reservation.duration = duration;
        reservation.hasEnded = true;
        return reservation.save();
    }).then(done => {
        return User.findById(done.user);
    }).then(payingUser => {
        payingUser.balance = (payingUser.balance - expenses + initialExpense).toFixed(2);
        return payingUser.save();
    }).then(result => {
        // firebase.sendRemoteNotification("Parking has ended" ,result.username);
        res.json({ expenses: expenses });
    }).catch(error => {
        res.status(422).json({ error: error.message });
    })
}