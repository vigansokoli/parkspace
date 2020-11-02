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
    var spotId = "5f95ea4ab515ee26e06d8586";

    // req.body.spotId;
    var userId = req.user;
    userId = "5f95a3f1f92fbe18047df3e1";

    /*                                      
        Need to fix the user id

        Authentication?!?!

        cookies/sessions?
        send a parameter in the response to be used
        accept a parameter in the response

        use JWT??

    */

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
                /* need to fix the duration if full day

                /*
                    get the spot working time
                    based on the working time and current time find the amount of hours to store in the duration.

                    currentTime and endTime

                */
            }

            reservation.user = user.id;
            reservation.phone = req.body.phone;

            reservation.licencePlate = req.body.licencePlate;

            return reservation.save();

        }).then(savedReservation => {
            console.log(savedReservation);
            var dateStarted = new Date(savedReservation.createdAt);
            console.log(dateStarted.getMinutes());
            dateStarted.setHours(dateStarted.getHours() + savedReservation.duration.hours);
            console.log(dateStarted);
            dateStarted.setMinutes(dateStarted.getMinutes() + savedReservation.duration.minutes);
            console.log(dateStarted);
            var bllablla = schedule.scheduleJob(dateStarted, function (savedReservation) {
                Reservation.update({ id: savedReservation.id }, { hasEnded: true }).then(updatedFields => {
                    console.log("updated:");
                    console.log(updatedFields);
                })
            })

            res.json(savedReservation);

        }).catch(err => {

            res.status(400).json(err);
        });

    } else {

    }

    // var newReservation = new Reservation(parameters);
    // await newSpot.save().then(spot=>{
    //   res.json(spot);
    // }).catch(err => {
    //   console.log(err);
    //   return res.status(422).json(err);
    // })
};


exports.end = async (req, res) => {

    var userId = req.body.user;
    var spotId = req.body.spot;

    Reservation.find({ user: userId, spot: spotId }).then(reservation => {
        console.log(reservation);
        console.log(reservation[0].duration);

        reservation = reservation[0];

        var startTime = reservation.createdAt;
        startTime = new Date(reservation.createdAt);
        startTime = startTime.getHours() + startTime.getMinutes() / 60;
        console.log(startTime);

        var endTime = new Date();
        var endTime = endTime.getHours() + endTime.getMinutes() / 60;
        console.log(endTime);

        var totalDuration = endTime - startTime;
        var expenses = parseFloat((totalDuration * price).toFixed(2));

        console.log(expenses);

        reservation.hasEnded = true;

        return reservation.save();
    }).then(blla =>{
        res.json({ expenses: expenses });
    })


    // .then(reservation=>{
    //     Spot.findById(reservation.spot).then(spot=>{

    //     })
    // });

    // const users = await User.find();
    // res.status(200).send({
    //     players: users.map(user => user.toJSON()),
    // });
};


// exports.start = async (req, res) => {
//     const users = await User.find();
//     res.status(200).send({
//         players: users.map(user => user.toJSON()),
//     });
// };


// exports.restart = async (req, res) => {
//     const users = await User.find();
//     res.status(200).send({
//         players: users.map(user => user.toJSON()),
//     });
// };

// exports.history = async (req, res) => {
//     const users = await User.find();
//     res.status(200).send({
//         players: users.map(user => user.toJSON()),
//     });
// };