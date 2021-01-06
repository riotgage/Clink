const express=require('express');
const app = express();
const router=express.Router()
const User=require('../models/UserSchema')
const bcrypt=require('bcryptjs')
app.set('view engine', 'pug');
app.set("views","views")

router.get("/", function(req, res){
    res.status(200).render("login")
})
router.post("/",async function(req, res){
    
    var payload=req.body;
    if(req.body.logUsername && req.body.logPassword){
        let user=await User.findOne({
            $or:[
                {Email:req.body.logUsername},
                {UserName:req.body.logUsername}
            ]
        },'+Password')
        .catch((error)=>{
            console.log(error)
            payload.errorMessage="Something went wrong";
            return res.status(200).render("login",payload);
        })

        console.log(user)
        if(user!=null){
            var result=await bcrypt.compare(req.body.logPassword,user.Password)
            if(result===true){
                req.session.user=user
                return res.redirect("/")
            }
        }
        payload.errorMessage="Password Wrong";
        return res.status(200).render("login",payload);
    }
    res.status(200).render("login")
})


module.exports=router;