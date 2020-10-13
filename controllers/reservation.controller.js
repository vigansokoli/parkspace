const Reservation = require(__dirname + "/models/Reservation");

exports.list = async (req, res) => {
    console.log("shit happening here");
    const users = await User.find();
    res.status(200).send({
        players: users.map(user => user.toJSON()),
    });
};


exports.new = async (req, res) => {
    const users = await User.find();
    res.status(200).send({
        players: users.map(user => user.toJSON()),
    });
};


exports.start = async (req, res) => {
    const users = await User.find();
    res.status(200).send({
        players: users.map(user => user.toJSON()),
    });
};


exports.restart = async (req, res) => {
    const users = await User.find();
    res.status(200).send({
        players: users.map(user => user.toJSON()),
    });
};

exports.history = async (req, res) => {
    const users = await User.find();
    res.status(200).send({
        players: users.map(user => user.toJSON()),
    });
};