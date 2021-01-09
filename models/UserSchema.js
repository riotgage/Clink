const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const schema=mongoose.Schema

const opts={
    timestamps: true,
}
const userSchema = new schema({
    FirstName: {
        type: 'string',
        required: [true,"First Name is required"],
        trim: true
    },
    LastName: {
        type: 'string',
        required: [true,"Last Name is required"],
        trim: true
    },
    UserName: {
        type: 'string',
        required: [true,"UserName is required"],
        trim: true,
        unique: true
    },
    Email: {
        type: 'string',
        required: [true,"email is required"],
        trim: true,
        unique: true
    },
    Password: {
        type: 'string',
        required: [true,"Password is required"],
        select:false
    },
    profilePic:{
        type: 'string',
        default:"/images/profilePic.png"
    },
    createdAt:{
        type:"Date"
    },
    likes:[{ 
            type: mongoose.Schema.ObjectId,
            ref:'Post'
    }],
    retweets:[{ 
        type: mongoose.Schema.ObjectId,
        ref:'Post'
    }],
},opts)

//encrypt password
userSchema.pre("save", async function (next) {
	if(!this.isModified('Password')){
		next();
	}
  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
});

var User=mongoose.model("User",userSchema);
module.exports=User