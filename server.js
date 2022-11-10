const express=require("express");
var db=require("./dbConnection.js");
const app=express();
const http=require("http").Server(app);
var io=require("socket.io")(http);

app.use(express.static("static"))

io.on("connection",function(socket){
	socket.on("addUser",function(data){
		db.collection(`users`).find({"_id":data["id"]}).toArray(function(err,result){
			if(result.length==0){
				db.collection("users1").insertOne(data,function(err){
					if(err) console.log(err);
					else{
						let response="user registered successfully"
						console.log(respose);
						socket.emit("response",response)
					}
				})
			}
			else{
				console.log("user already existed");
			}
		});
		//socket.user=data["name"];
		//socket.join(data["name"]);
		//socket.broadcast.emit("message",socket.id);
		//io.to(data.rec).emit("message",{"from":data["name"],"message":data["message"]})
	})
	
	socket.on("startChat",function(data){
		var clients=[data["sender"],data["client"]];
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
				io.to([data["client"],data["sender"]]).emit("message",{"from":data["sender"],"message":data["message"]})
				let response="message sent successfully";
				console.log(response);			
			}
		})
	})
	
	socket.on("fetchMsg",function(data){
		var clients=[data["sender"],data["client"]];		
		if(data["client"]<data["sender"]){
			clients.reverse();
		}		
		db.collection(`C${clients[0]}_${clients[1]}`).find({}).toArray(function(err,result){
			if(err) console.log(err)
			else{
				for(i of result){	
					var sender=i["from"]==1?clients[0]:clients[1];
					io.to(data["sender"]).emit("message",{"from":sender,"message":i["message"]})
				}
			}
		})
	});
	
	socket.on("newUser",function(data){
		console.log(data)
		socket.join(data["phone"]);
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

