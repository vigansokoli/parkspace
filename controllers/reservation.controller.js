const Reservation = require("../models/Reservation");
const Spot = require("../models/Spot");
const User = require("../models/User");
var { price } = require("../config");
var schedule = require("node-schedule");
const { unsubscribe } = require("../routes/users");

exports.list = async (req, res) => {
    const reservations = await Reservation.find();
    res.status(200).send({
        reservations: reservations.map(resrvation => resrvation.toJSON()),
    });
};

exports.new = async (req, res, next) => {
    var parameters = req.body;
    var spotId = req.body.spot;
    var userId = req.user;

    if (userId) {
        User.findById(userId).then(user => {
            var reservation = new Reservation();
            reservation.spot = spotId;

            if (!req.body.fullDay) {
                reservation.duration = req.body.duration;
            } else {
                reservation.fullDay = true;
            }

            reservation.user = user.id;
            // reservation.phone = req.body.phone;

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

                Reservation.update({ id: savedReservation.id }, { hasEnded: true }).then(updatedFields => {
                    return User.findById(savedReservation.user);
                }).then(payingUser=> {
                    console.log(payingUser);
                    console.log(expenses);
                    console.log(payingUser.balance)
                    payingUser.balance = payingUser.balance - expenses;
                    console.log(payingUser.balance);
                    return payingUser.save();
                }).then(result=>{
                    // res.json({ expenses: expenses });
                    console.log(result);
                }).catch(err=>{
                    console.log('caught it');
                    console.log(err);
                })
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json(err);
        });

    } else {
        
    }

};

exports.end = async (req, res) => {

    var userId = req.user;
    var expenses = 0;

    Reservation.findById(req.body.id).then(reservation => {

        if(reservation.hasEnded)
            return res.json({ err: "The reservation had ended" });

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

        reservation.duration = duration;
        reservation.hasEnded = true;
        return reservation.save();
    }).then(done =>{
        return User.findById(done.user);
    }).then(payingUser=> {
        payingUser.balance = payingUser.balance - expenses;

        return payingUser.save();
    }).then(result=>{
        res.json({ expenses: expenses });
    })
}