const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js"); 

// multer data
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }) //now multer will save files in cloudinary storage


// Index Route
router.get("/", wrapAsync(listingController.index));

// New route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

// Show/Read Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post("/",isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing))

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))

// Update Route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))

// Delete Route
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))


// Note - we can use router.route method to combine different verbs of same path 
// example lets combine index and create route as both are having same path "/" 
// router.route("/")
// .get( wrapAsync(listingController.index))
// .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing))
// but if it's confusing you can avoid it


module.exports = router;