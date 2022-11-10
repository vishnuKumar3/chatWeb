var {MongoClient} = require('mongodb');
var client=new MongoClient("mongodb://localhost:27017")
client.connect(function(err){
	if(err) console.log(err)
	else{
		console.log("mongodb connection established");
	}
})
var db=client.db("chatWeb")
module.exports=db;
