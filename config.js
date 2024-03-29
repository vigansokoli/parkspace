const { IS_DOKKU } = process.env
const isDokku = IS_DOKKU && IS_DOKKU === 'true' || false;

// no need run this if we use the dokku deployment process
// if (!isDokku) {
  require('dotenv').config();
// }

module.exports = {
  tokenSecret: process.env.TOKEN_SECRET,
  mongoDBServer: process.env.MONGODB_URI || process.env.MONGO_URL,
  mongoDBLocal: process.env.MONGODB_LOCAL_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },
  isDokku,
  price : 1.7,
  secret: process.env.SECRET,
  firebaseCredUrl: process.env.FIREBASE_CRED_URL,
  firebaseDBUrl: process.env.FIREBASE_DB_URL,
  smtp: {
    server: process.env.SMTP_SERVER,
    username: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    port: process.env.SMTP_PORT
  },
  url: process.env.URL
};