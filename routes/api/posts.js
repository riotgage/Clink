const express=require('express');
const app = express();
const router=express.Router()
const Post=require('../../models/PostSchema');
const User=require('../../models/UserSchema');
const {requireLogin}=require('../../middleware/protect')

router.get("/", function(req, res){
    Post.find()
    .populate("postedBy")
    .populate("retweetData")
    .sort({createdAt: -1})
    .then(async (data)=>{
        data=await User.populate(data,{path:"retweetData.postedBy"})
        res.status(200).send(data);
    })
    .catch((err)=>{
        console.error(err);
        res.sendStatus(400);
    })
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
    if(!req.session.user){
        return res.redirect("/login");
    }
    Post.create(postData)
    .then(async function(newPost){
        newPost=await User.populate(newPost,{path:"postedBy"});
        return res.status(201).json(newPost);
    })
    .catch((error)=>{
        return res.status(400).json({
            success:false,
            data:error.message
        })
    })
})

router.put("/:id/like",async function(req, res){
    
    var postId=req.params.id;
    var userId=req.session.user._id;
    var user=await User.findOne({
        _id:userId
    })
    var isLiked=user.likes && user.likes.includes(postId);
    console.log(isLiked)
    var option =isLiked ? "$pull":"$addToSet";
    req.session.user=await User.findByIdAndUpdate(userId,{
        [option]:{likes:postId}
    },{
        new:true
    }).catch(error=>{
        return res.sendstatus(404);
    })

    var post=await Post.findByIdAndUpdate(postId,{
        [option]:{likes:userId}
    },{
        new:true
    }).catch(error=>{
        return res.sendstatus(404);
    })

    res.status(200).send(post);
})

router.post("/:id/retweet",async function(req, res){

    var postId=req.params.id;
    var userId=req.session.user._id;
   
    // Try and delete retweet
     var deletedPost=await Post.findOneAndDelete({
        postedBy:userId,
        retweetData:postId
     }).catch(error=>{
         console.log(error);
        return res.sendstatus(400);
    })
    var option =deletedPost!=null ? "$pull":"$addToSet";
    var repost=deletedPost;

    if(repost==null){
        repost=await Post.create({
            postedBy:userId,
            retweetData:postId
        }).catch(error=>{
           console.log(error);
           return res.sendstatus(400);
       })
    }

    req.session.user=await User.findByIdAndUpdate(userId,{
        [option]:{retweets:repost._id}
    },{
        new:true
    }).catch(error=>{
        return res.sendstatus(404);
    })

    var post=await Post.findByIdAndUpdate(postId,{
        [option]:{retweetUsers:userId}
    },{
        new:true
    }).catch(error=>{
        return res.sendstatus(404);
    })

    res.status(200).send(post);
})

module.exports=router;