const app=require("express");
const router=app.Router();
const db=require("./dbConnection.js");
const bcrypt=require("bcrypt");
module.exports=router;

router.post("/signup",function(req,res){
	var formData=req.body;
	formData["_id"]=parseInt(formData["_id"]);
	formData["password"]=bcrypt.hashSync(formData["password"],10);
	db.collection("authenticate").insertOne(formData,function(err,data){
		if(err) {console.log(err);return res.json({"msg":"user not added"});}
		else{
			{console.log(data);return res.json({"msg":"user added successfully"});}
		}
	})
	
})

router.post("/signin",function(req,res){
	var formData=req.body;
	formData["_id"]=parseInt(formData["_id"]);
	db.collection("authenticate").findOne({"_id":formData["_id"]},function(err,data){
		if(err) {console.log(err);return res.json({"status":false,"msg":"server side error"});}
		else{
			console.log(data);
				if(data==null){
					return res.json({"status":false,"msg":"user doesn't exist"});				
				}
				var ret=bcrypt.compareSync(formData["password"],data["password"]);
				if(ret){
					return res.json({"status":true,"msg":"sigin successful"});
				}
				else{
					return res.json({"status":false,"msg":"username or password might be wrong"});					
				}
		}
	})
	
})
