if(process.env.NODE_ENV != "production"){
    require("dotenv").config(); 
}

const express = require("express");
const app = express();
const port = 8080;

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const mongoose = require("mongoose");

const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);


// express Router
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// for error handling
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// for server side validation
const {listingSchema,reviewSchema} = require("./schema.js");


// for session handling
const session = require("express-session");
const MongoStore = require("connect-mongo");

// for flash connection
const flash = require("connect-flash");


// for password
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// Database connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderstay"; //locally
const dbUrl = process.env.ATLAS_DB_URl; //using atlas

main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
})

async function main() {
    // await mongoose.connect(MONGO_URL); //locally
    await mongoose.connect(dbUrl); //using atlas
}

const path = require("path");
const { error } = require("console");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));



// on production side
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET_CODE
    },
    touchAfter:24*3600 //after this much seconds i.e 1 day session will refresh
})

store.on("error",()=>{
    console.log("Error in Mongo Session Store ",error);
})

// declaring session options on development side
const sessionOptions = {
    store,
    secret : process.env.SECRET_CODE,
    resave:false,
    saveUninitialized:true,
    cookie :{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //i.e after 1 week cookie will get expired so user will have to login again
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};


app.use(session(sessionOptions));
// flash using
app.use(flash());


// middleware for password checking before each page ,ye 5 line humesha likho just pass your model name here it is User
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// demo user register route
// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"abc@gmail.com",
//         username:"Harry" //we didn't mention username is Schema but passport package automatically saves it
//     })

//     // using User.register method we take two parameters first is other details and second is password
//     let registeredUser = await User.register(fakeUser,"helloworld"); 
//     res.send(registeredUser);
// })



// Home/root Route
// app.get("/", (req, res) => {
//     res.send("Heello buddies");
// })


// middleware for flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //using res.locals now we can access this req.user in any other files too like ejs,or js etc
    next();
})


// using routes with the help of express router
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})


// error handling
app.use((err, req, res, next) => {
    let {statusCode=500,message="Something went Wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
    // res.status(statusCode).send(message);
})



app.listen(port, () => {
    console.log("App is listening to port : ", port);
})