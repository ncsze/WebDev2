const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;
//Credit: Patrick Hill
//https://github.com/stevens-cs546-cs554/CS-546/blob/master/lecture_04/code/mongoConnection.js
module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};