const Listing = require("../models/listing.js");


// index route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

// new route
module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
}

// show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}


// create route
module.exports.createListing = async (req, res, next) => {
    //    let {title,description,image,price,location,country} = req.body;
    //    let listing = req.body.listing;


    // normal way for error handling
    //  try {
    //     const newListing = new Listing(req.body.listing);
    //     await newListing.save();
    //     res.redirect("/listings");  
    //  } catch (err) {
    //     next(err);
    //  }


    // wrapasync way
    // if(!req.body.listing)
    // {
    //     throw new ExpressError(400,"Send valid data for listing!");
    // }
   
    let url= req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New listing Created!");
    res.redirect("/listings");
}


// edit route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist");
        return res.redirect("/login");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_350");
    res.render("listings/edit.ejs", { listing , originalImageUrl});
}


// update route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

   if(typeof req.file !== "undefined"){
    let url= req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
   }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}


// delete route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}

