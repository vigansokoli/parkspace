var admin = require("firebase-admin");
var { firebaseCredUrl, firebaseDBUrl } = require("./config");

admin.initializeApp({
  credential: admin.credential.cert(firebaseCredUrl),
  databaseURL: firebaseDBUrl
});

module.exports = {
  sendRemoteNotification(message, userTokens) {
    var payload = {
      notification: {
        title: "Parkspace",
        body: message,
      },
    };

    var options = {
      priority: "normal",
      timeToLive: 60 * 60,
    };

    admin
      .messaging()
      .sendToDevice(userTokens, payload, options)
      .then(function (response) {
        console.log("Successfully sent message:", response);
      })
      .catch(function (error) {
        console.log("Error sending message:", error);
      });
  }
}
