const User = require("../models/user.js");


// signup get route
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}


// signup post route
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {  //req.login will ensure as soon as you signup you will automatically get logged in
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderStay!!");
            res.redirect("/listings");
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


// login get route
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}


// login post route
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderStay!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


// logout
module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You have successfully logged out!");
        res.redirect("/listings");
    })
}