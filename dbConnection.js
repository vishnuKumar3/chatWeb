var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/chatWeb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  module.exports=db;
});