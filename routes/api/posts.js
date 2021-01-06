const express=require('express');
const app = express();
const router=express.Router()
const Post=require('../../models/PostSchema');
const User=require('../../models/UserSchema');
router.get("/", function(req, res){

})

router.post("/",async function(req, res){
    if(!req.body.content){
        console.log("Content not sent!");
        return res.status(400).json({
            success:false,
            data:"Content sent is empty"
        });
    }
    var postData={
        content:req.body.content,
        postedBy:req.session.user
    } 
    Post.create(postData)
    .then(async function(newPost){
        newPost=await User.populate(newPost,{path:"postedBy"});
        console.log(newPost);
        return res.status(201).json(newPost);
    })
    .catch((error)=>{
        return res.status(400).json({
            success:false,
            data:error.message
        })
    })
})

module.exports=router;