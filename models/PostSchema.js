const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const schema=mongoose.Schema

const opts={
    timestamps: true,
}
const PostSchema = new schema({
    content:{
        type: String,
        trim:true,
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    pinned:Boolean,
    likes:[{ 
            type: mongoose.Schema.ObjectId,
            ref:'User'
        }
    ]

},opts)


module.exports=mongoose.model("Post",PostSchema);