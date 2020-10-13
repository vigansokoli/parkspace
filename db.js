let mongoose = require('mongoose');
const {mongoDBServer, mongoDBLocal, nodeEnv} = require("./config");

class Database {
  constructor() {
    this._connect()
  }

_connect() {
  let mongoDBURI = mongoDBLocal;

  if(nodeEnv == "production")
    mongoDBURI = mongoDBServer;
    
     mongoose.connect(mongoDBURI,
     {
        useNewUrlParser: true,
        useUnifiedTopology: true,// creates the false index for the user create
        useFindAndModify: false,
        useCreateIndex: true
      })
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error: ' + err)
       })
  }
}

module.exports = new Database()