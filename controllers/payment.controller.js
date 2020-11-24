const Reservation = require("../models/Reservation");
const Spot = require("../models/Spot");
const User = require("../models/User");
var { price } = require("../config");
var schedule = require("node-schedule");

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
            console.log(user);
            return user;
        }).then(user => {
            var reservation = new Reservation();
            reservation.spot = spotId;

            if (!req.body.fullDay) {
                reservation.duration = req.body.duration;
            } else {
                reservation.fullDay = true;
            }

            reservation.user = user.id;
            reservation.phone = req.body.phone;

            reservation.licencePlate = req.body.licencePlate;

            return reservation.save();

        }).then(savedReservation => {

            var dateStarted = new Date(savedReservation.createdAt);
            dateStarted.setHours(dateStarted.getHours() + savedReservation.duration.hours);
            dateStarted.setMinutes(dateStarted.getMinutes() + savedReservation.duration.minutes);

            var scheduling = schedule.scheduleJob(dateStarted, function (savedReservation) {
                Reservation.update({ id: savedReservation.id }, { hasEnded: true }).then(updatedFields => {
                    console.log("updated:");
                    console.log(updatedFields);
                })
            })

            res.json(savedReservation);

        }).catch(err => {
            console.log(err);
            res.status(400).json(err);
        });

    } else {
        
    }

};


exports.end = async (req, res) => {

    var userId = req.user;
    var spotId = req.body.spot;

    Reservation.find({ user: userId, spot: spotId }).then(reservation => {
        console.log(reservation);
        console.log(reservation[0].duration);

        reservation = reservation[0];

        var startTime = reservation.createdAt;
        startTime = new Date(reservation.createdAt);
        startTime = startTime.getHours() + startTime.getMinutes() / 60;

        var endTime = new Date();
        var endTime = endTime.getHours() + endTime.getMinutes() / 60;

        var totalDuration = endTime - startTime;
        var expenses = parseFloat((totalDuration * price).toFixed(2));

        res.json({ expenses: expenses });

        reservation.hasEnded = true;
        return reservation.save();
    })
}