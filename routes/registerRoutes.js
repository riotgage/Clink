const e = require('express');
const express=require('express');
const app = express();
const router=express.Router()
const User = require('../models/UserSchema')
app.set('view engine', 'pug');
app.set("views","views")

router.get("/", function(req, res){

    res.status(200).render("register")
})

router.post("/", async function(req, res){

    firstname=req.body.FirstName.trim();
    lastname=req.body.LastName.trim();
    username=req.body.UserName.trim();
    email=req.body.Email.trim();
    password=req.body.Password;
    var payload=req.body;

    if(firstname && lastname && username && password && email){
        let user=await User.findOne({
            $or:[
                {Email:email},
                {UserName:username}
            ]
        })
        .catch((error)=>{
            console.log(error)
            payload.errorMessage="Something went wrong";
            res.status(200).render("register",payload)
        })

        if(user){
            if(email==user.Email)
                payload.errorMessage="Email is already registered";
            else {
                payload.errorMessage="Username is already registered";
            }
            return res.status(200).render("register",payload); 
        }

        try{
            let user=await User.create(req.body)
            req.session.user=user;  
            return res.redirect("/");
        }catch(e){
            return res.status(200).render("register",payload);
        }
    }
    else{         
        payload.errorMessage="Make Sure each field has a value";
        return res.status(200).render("register",payload);
    }
    res.status(200).render("register")
})
module.exports=router;
