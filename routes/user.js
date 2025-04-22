const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

// signup get route
router.get("/signup", userController.renderSignUpForm)


// signup post route
router.post("/signup", wrapAsync(userController.signup))



// login get route
router.get("/login", userController.renderLoginForm)


// login post route
router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login)


// logout get route
router.get("/logout",userController.logout)


module.exports = router;