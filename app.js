const express=require('express');
const path=require('path');
const app=express();
const PORT=process.env.PORT || 3000;
const connectDB=require('./utils/db')
const dotenv=require('dotenv');
const morgan=require('morgan');
const session=require('express-session');


const {requireLogin}=require('./middleware/protect')

// Load env file
dotenv.config({path:'./config/config.env'})


//Middleware 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saceUninitialized: false
}))

//Template Engine
app.set('view engine', 'pug'); 
app.set('views','views')
app.use(express.static(path.join(__dirname,'public'))) 

connectDB();
//Routes
const loginRoute=require('./routes/loginRoutes')
const registerRoute=require('./routes/registerRoutes')
const logoutRoute=require('./routes/logoutRoutes')
const postApiRoutes=require('./routes/api/posts')
app.use('/login',loginRoute)
app.use('/register',registerRoute)
app.use('/logout',logoutRoute)

app.use('/api/posts',postApiRoutes);

app.get('/', requireLogin,function(req, res){
    let payload={
        title: 'Home',
        userLoggedIn:req.session.user
    }
    res.status(200).render("home",payload)
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});