const express=require('express');
const router=express.Router()
const User=require('../models/UserSchema')


router.get("/", function(req, res){
    if(req.session){
        req.session.destroy(()=>{
            res.redirect("/login");
        })
    }
})

module.exports=router;