const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express.Router();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.get("/",function(req,res){
	req.socket.on("subroute",function(data){
		console.log("subroutes");
	})
	res.sendFile(__dirname+"/static/home.html");
})

module.exports=app
