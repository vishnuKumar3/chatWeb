const express=require("express")
const app=express.Router();
const bodyparser=require("body-parser");
const db=require("./dbConnection.js");

app.use(express.json())
app.use(express.static("static"))
app.use(bodyparser.urlencoded({"extended":false}))
module.exports=app

app.post("/addUser",function(req,res){
		var data=req.body //{"_id":int,"name":string,"contacts":[]}
		console.log(data,req.body);
		db.collection('users').find({"_id":data["_id"]}).toArray(function(err,result){
			if(result.length==0){
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
			contacts.push(req.body.phone);
			db.collection("users").updateOne(identity,{$set:{"contacts":contacts}},function(err,data2){
				if(err) {
					console.log(err)
					return res.json({"msg":"contacts doesnot added"})
				}
				else {
					console.log(data2);
					return res.json({"msg":"contact added successfully"});
				}
				
			})
		})	
})

app.post("/fetchContacts",function(req,res){
		var user=req.body.user;//{user:int("_id")}
		db.collection("users").find({"_id":user}).toArray(function(err,data){
			if(err) {
				console.log(err);
				return res.json({"status":false,"msg":"contacts doesn't fetched","data":[]});				
			}
			else{
				return res.json({"status":true,"msg":"contacts fetched successfully","data":data[0].contacts});							
			}
		})
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
				return res.json({"status":true,"msg":"data fetched successfully","data":ret});
			}
		})	
})

