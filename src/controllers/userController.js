const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const User = require("../db/models").User;
const wikiQueries = require("../db/queries.wikis.js");
const publishableKey = process.env.PUBLISHABLE_KEY;
const secretKey = process.env.SECRET_KEY;

module.exports = {
    signUp(req, res, next) {
        res.render("users/signup");
    },

    create(req, res, next) {
        let newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };

        userQueries.createUser(newUser, (err, user) => {
            if (err) {
                req.flash("error in create", err);
                res.redirect("/users/signup");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed up!");
                    res.redirect("/");
                })
            }
        });
    },

    signInForm(req, res, next) {
        res.render("users/signin");
    },

    signIn(req, res, next) {
        passport.authenticate("local")(req, res, function () {
            if (!req.user) {
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/signin");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/")
            }
        })
    },

    signOut(req, res, next) {
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },

    edit(req, res, next){
        User.findById(req.user.id)
            .then((user) => {
                res.render("users/edit", {user})
            })
    },

    upgrade(req, res, next) {
        User.findById(req.user.id)
            .then((user) => {
                const stripe = require("stripe")(publishableKey);
                const token = req.body.stripeToken; // Using Express
                const charge = stripe.charges.create({
                    amount: 1500,
                    currency: 'usd',
                    description: 'Upgrade to Premium Account',
                    source: token,
                }, (err, charge) => {
                    user.updateAttributes({role: "premium"});
                    req.flash("notice", "You are now upgraded to premium");
                    res.redirect("/");
                });

            })
            .catch((err) => {
                console.log(err);
                done();
            })
    },

    downgrade(req, res, next) {
        wikiQueries.userPublic(req.user.dataValues.id);
        User.findById(req.user.id)
            .then((user) => {
                user.updateAttributes({role: "standard"});
                req.flash("notice", "You are now a standard user");
                res.redirect("/");
            })
            .catch((err) => {
                console.log(err);
                done();
            })
    },

    showCollaborations(req, res, next) {
        userQueries.getUser(req.user.id, (err, result) => {
            console.log(result);
            user = result["user"];
            collaborations = result["collaborations"];
            if(err || user === null) {
                res.redirect(404, "/");
            } else {
                res.render("users/collaborations", {user, collaborations})
            }
        })
    }
}