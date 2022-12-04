const express=require("express")
const app=express.Router();
const db=require("./dbConnection.js");
const fs=require("fs");
module.exports=app

app.post("/addUser",function(req,res){
		var data=req.body //{"_id":int,"name":string,"contacts":[]}
		
		console.log(data,req.body,req.files[0]);
		data["_id"]=parseInt(data["_id"]);
		data["contacts"]=[];
		db.collection('users').find({"_id":data["_id"]}).toArray(function(err,result){
			if(result.length==0){
				var oldpath=req.files[0];
				var newpath="./static/dp/"+data["_id"].toString()+"."+oldpath["mimetype"].split("/")[1];
				fs.rename(req.files[0].path,newpath,function(err){
					if(err) console.log(err); 
					else console.log("dp inserted")
				});
				data["dp"]="dp/"+data["_id"].toString()+"."+oldpath["mimetype"].split("/")[1];
				db.collection("users").insertOne(data,function(err){
					if(err) console.log(err);
					else{
						let response="user registered successfully"
						console.log(response);
						return res.json({"msg":response});
					}
				})
			}
			else{
				let response="user already existed";
				console.log(response);
				return res.json({"msg":response});				
			}
		});	
})

app.post("/addContact",function(req,res){
		var identity={"_id":req.body.user} //{"user":int,"phone":int}
		db.collection("users").find(identity).toArray(function(err,data1){
			console.log(data1,"hello")
			var contacts=data1[0].contacts;
			if(contacts.includes(req.body.phone)){
					return res.json({"status":false,"msg":"contact already existed"});				
			}
			contacts.push(req.body.phone);
			db.collection("users").updateOne(identity,{$set:{"contacts":contacts}},function(err,data2){
				if(err) {
					console.log(err)
					return res.json({"status":false,"msg":"contacts doesnot added"})
				}
				else {
					console.log(data2);
					return res.json({"status":true,"msg":"contact added successfully"});
				}
				
			})
		})	
})

app.post("/fetchContacts",function(req,res){
		var user=req.body.user;//{user:int("_id")}
		console.log(user);
		db.collection("users").find({"_id":user}).toArray(function(err,data){
			if(err) {
				console.log(err);
				return res.json({"status":false,"msg":"contacts doesn't fetched","data":[]});				
			}
			else{
				var totalLength=data[0].contacts.length;
				ret=[]			
				data[0].contacts.map((user)=>{
					db.collection("users").findOne({"_id":user},function(err,result){
						ret.push(result);
					if(ret.length==totalLength)
						return res.json({"status":true,"msg":"contacts fetched successfully","data":ret});						
				})
							
			})
		}})
})

app.post("/fetchMsg",function(req,res){
		var data=req.body;//{sender:int(_id),client:int(_id)}
		var clients=[data["sender"],data["client"]];		
		if(data["client"]<data["sender"]){
			clients.reverse();
		}		
		db.collection(`C${clients[0]}_${clients[1]}`).find({}).toArray(function(err,result){
			if(err) {
				console.log(err);
				return res.json({"status":false,"msg":"data doesn't fetched","data":[]});
			}
			else{
				var ret=[]
				for(i of result){	
					var sender=i["from"]==1?clients[0]:clients[1];
					ret.push({"msg":i["message"],"from":sender});
				}
				//console.log(ret,clients);
				return res.json({"status":true,"msg":"data fetched successfully","data":ret});
			}
		})	
})

