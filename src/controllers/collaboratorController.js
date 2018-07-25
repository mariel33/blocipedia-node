const express = require("express");
const router = express.Router();
const collabQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/application");
const wikiQueries = require("../db/queries.wikis.js");

module.exports = {
    add(req, res, next){
        collabQueries.add(req, (err, collaborators) => {
            if(err) {
                console.log(err);
                req.flash("Error", err)
            } else {
                res.redirect(req.headers.referer);
            }

        })
    },

    edit(req, res, next) {
        wikiQueries.getWiki(req.params.wikiId, (err, result) => {
            wiki = result["wiki"];
            collaborators = result["collaborators"]
            if(err || result.wiki == null) {
                res.redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user, wiki, collaborators).edit();
                if(authorized){
                    console.log("authorized");
                    res.render("collaborators/edit", {wiki, collaborators});
                } else {
                    console.log("not authorized");
                    res.flash("You are not authorized to do that");
                    res.redirect(`/wikis/${req.params.wikiId}`);
                }
            }
        });
    },

    remove(req, res, next){
        collabQueries.delete(req, (err, collaborator) => {
            if(err) {
                req.flash("error", err);    
            } else {
                res.redirect(req.headers.referer);
            }
        });

    }
}