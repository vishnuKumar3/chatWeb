const express=require("express");
var db=require("./dbConnection.js");
const app=express();
const http=require("http").Server(app);
var io=require("socket.io")(http);

app.use(express.static("static"))

io.on("connection",function(socket){
	socket.on("newUser",function(data){
		socket.user=data["name"];
		socket.join(data["name"]);
		//socket.broadcast.emit("message",socket.id);
		io.to(data.rec).emit("message",{"from":data["name"],"message":data["message"]})

	})
	
	socket.on("disconnect",function(){
		console.log("user disconnected",socket.id);
	})
})

app.get("/",function(res,res){
	res.sendFile(__dirname+"/static/client.html");
})
http.listen(8080,function(){
	console.log("API activated");
})
