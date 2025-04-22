const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");
const {reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must logged in to create your own listing!");
        return res.redirect("/login");
    }
    next();
};


// for redirecting to the same path where user clicked before logging in 
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}



// for validating owner of listing
module.exports.isOwner = async (req,res,next) => {
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// for validating owner of review
module.exports.isReviewAuthor = async (req,res,next) => {
    let{id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



// validate listing model
module.exports.validateListing = (req,res,next)=>{
    let {err} = listingSchema.validate(req.body);
    if(err){
        throw new ExpressError(400,err);
    }
    else{
        next();
    }
}



// validate review model
module.exports.validateReview = (req,res,next)=>{
    let {err} = reviewSchema.validate(req.body);
    if(err){
        throw new ExpressError(400,err);
    }
    else{
        next();
    }
}