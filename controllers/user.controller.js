// const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const Game = require("../models/Game");
// const Round = require("../models/Round");
// const Guesses = require("../models/GuessSchema");
// const { loginValidation } = require("./validation");
// const { tokenSecret } = require("../config");
// const s3Service = require('../services/s3.service');

exports.list = async (req, res) => {
    console.log("shit happening here");
  const users = await User.find();
  res.status(200).send({
    players: users.map(user => user.toJSON()),
  });
};

exports.login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    console.log(error);
  return res
      .status(422)
      .send({ error: { message: error.details[0].message } });
  }

  try {
    let user = await User.findOne({ deviceID: req.body.deviceID });
    if (!user) {
      user = new User();
    }

    const avatar = req.file;
    if (!avatar && !user.avatarUrl) {
    return res.status(422).json({ errors: { message: 'avatar can\'t be blank' } });
    }

    if (avatar) {
      const avatarData = await s3Service.upload(avatar, user._id);
      user.avatarUrl = avatarData.Key;
    }

    user.username = req.body.username;
    user.deviceID = req.body.deviceID;

    try {
      const newUser = await user.save();
      const token = jwt.sign({ _id: user._id }, tokenSecret);
      res
        .header("authorization", token)
        .status(200)
        .send({ authorization: token, player: newUser.toJSON() });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: { user: err.message } });
  }
};

exports.user_update_notification = function (req, res) {
  var userId = req.user._id;

  if (!req.body.token) {
    return res
      .status(422)
      .json({ errors: { message: "token can't be blank" } });
  }

  User.findById(userId, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(500).json({ errors: { user: err } });
    }
    if (!user) {
      var msg = "user with id (" + userId + ") not found";
      return res.status(500).json({ errors: { user: msg } });
    }
    user.notificationToken = req.body.token;
    user.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ errors: { user: err } });
      } else {
        return res.json({ success: true });
      }
    });
  });
};

exports.user_post_statistics = function (req, res) {
  let user = req.user;

  var results = {};
  var totalGames = 0;
  var wonGames = 0;
  var skippedWords = 0;
  var buzzedWords = 0;
  var completedWords = 0;
  var cluegiverHighScore = 0;
  var buzzCount = 0;
  var cluegiverPoints = 0;
  var guesserHighScore = 0;
  var totalGuesses = 0;
  var totalFirstPlace = 0;
  var totalWords = 0;

  Game.find({ players: { $in: [user._id] } })
    .populate("rounds")
    .then(games => {
      // console.log("the results are " + game);

      totalGames = games.length;

      games.forEach(game => {
        var index = game.findPlayerIndex(user._id);

        var currentPoints = game.points[index];

        if (currentPoints > guesserHighScore)
          guesserHighScore = currentPoints;
      });

      return Game.find({ winner: { $in: [user._id] } })
        .populate("rounds");
    })
    .then(games => {
      console.log("the winner is " + games.length);
      wonGames = games.length;

      return Round.find({ cluegiver: user._id })
        .populate("players");
    })
    .then(rounds => {
      if (rounds.length != 0) {
        rounds.forEach(round => {
          var tempHighScore = 0;
          skippedWords += round.skippedWords.length;
          buzzedWords += round.buzzedWords.length;
          completedWords += round.guessedWords.length;
          var pointsIndex = round.findPlayerIndex(user);

          tempHighScore = round.points[pointsIndex];
          if (tempHighScore > cluegiverHighScore)
            cluegiverHighScore = tempHighScore;
        });
      }

      return Round.find({ buzzer: user._id });
    }).then(rounds => {
      rounds.forEach(round => {
        buzzCount += round.buzzedWords.length;
      });

      return Guesses.find({ player: user._id })
        .populate("rounds");
    })
    .then(games => {
      // console.log("the games are " + games)
      games.forEach(game => {
        totalGuesses += game.position.length;

        game.position.forEach(currpos => {
          if (currpos == 1) totalFirstPlace++;
        });
      });

      return Round.find({ players: { $in: [user._id] } })
        .populate("players");
    })
    .then(rounds => {
      rounds.forEach(round => {
        if (
          round.buzzer != user._id &&
          round.cluegiver != user._id
        ) {
          totalWords +=
            round.guessedWords.length +
            round.skippedWords.length +
            round.buzzedWords.length +
            1;
        }
      });

      results = {
        games: {
          wins: wonGames,
          total: totalGames
        },
        cluegiver: {
          buzzes: buzzedWords,
          skips: skippedWords,
          guessed: completedWords,
          highscore: cluegiverHighScore
        },
        guesser: {
          solved: totalGuesses,
          first: totalFirstPlace,
          highscore: guesserHighScore,
          words: totalWords
        },
        buzzer: {
          count: buzzCount
        }
      };

      res.json(results);
    }).catch(err => {

      console.log(err);

      return res
        .status(422)
        .send({ error: { message: error.details[0].message } });
    });
};

exports.user_post_upgrade = function (req, res) {
  var userId = req.user._id;

  User.updateOne({ _id: userId }, { isPremium: true })
    .then(user => {
      return res.json(user);
    })
    .catch(err => {
      console.log(err);
      return res.status(422).send({ error: { message: err.message } });
    });
};

exports.user_post_clean = function (req, res) {
  var prevDate = new Date();

  var minuteChange = req.body.minutes;
  prevDate.setMinutes(prevDate.getMinutes() - minuteChange);

  Game.updateMany(
    { $and: [{ hasFinished: false }, { createdAt: { $lte: prevDate } }] },
    { hasFinished: true }
  ).then(updateSuccess => {
    console.log("Game Recycling Success: " + JSON.stringify(updateSuccess));

    return User.updateMany(
      {
        $and: [
          { currentGame: { $ne: null } },
          { updatedAt: { $lte: prevDate } }
        ]
      },
      { currentGame: null, online: false }
    );
        
  }).then(success => {
    console.log("User Recycling Success: " + JSON.stringify(success));

    return res.json({ game: updateSuccess, user: success });
  }).catch(err=> {

    console.log(err);
    return res.status(422).send({ error: { message: err.message } });
  })
};