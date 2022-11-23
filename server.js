const express = require("express");
const { createServer } = require("http");
const bodyparser=require("body-parser");
const { Server } = require("socket.io");
const multer=require("multer");
const app = express();
const cors=require("cors");
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const user=require("./User.js");
const db=require("./dbConnection.js");
const sub=require("./sub.js");

app.use(express.json());
app.use(cors({
	"origin":"*"
}))
app.use(bodyparser.urlencoded({"extended":false}))
app.use(express.static("static"))
app.use(multer({"dest":"./static/dp"}).any());
app.use("/sub",sub);
app.use("/user",user);

io.on("connection",function(socket){
	//socket.user=data["name"];
	//socket.join(data["name"]);
	//socket.broadcast.emit("message",socket.id);
	//io.to(data.rec).emit("message",{"from":data["name"],"message":data["message"]})	

	
	socket.on("startChat",function(data){
		var clients=[data["sender"],data["client"]];
		console.log(data);
		console.log(data["sender"],typeof(parseInt(data["sender"])))
		var insertedData={
			"message":data["message"],
			"from":1
		}		
		if(data["client"]<data["sender"]){
			clients.reverse();
			insertedData["from"]=2
		}
		db.collection(`C${clients[0]}_${clients[1]}`).insertOne(insertedData,function(err,result){
			if(err) console.log("message not inserted");
			else{
				console.log(data);
				io.to([data["client"],data["sender"]]).emit("message",{"from":data["sender"],"msg":data["message"]})
				let response="message sent successfully";
				console.log(response);			
			}
		})
	})
	
	socket.on("newUser",function(data){
		console.log(data)
		socket.userData=data;
		socket.join(data["phone"]);
	})
	
	
	socket.on("disconnect",function(){
		console.log("user disconnected",socket.id);
	})
})



app.get("/",function(req,res){
	res.sendFile(__dirname+"/static/home.html");
})
httpServer.listen(8080,function(){
	console.log("API connected");
});

