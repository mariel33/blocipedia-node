const Wiki = require("./models").Wiki;
const Collaborators = require("./models").Collaborators;
const User = require("./models").User;
const Authorizer = require("../policies/application");

module.exports = {

    getAllWikis(callback){
        return Wiki.all()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getWiki(id, callback){
        let result = {};
        Wiki.findById(id)
        .then((wiki) => {
            console.log(wiki)
            if(!wiki) {
                callback(404);
            } else {
                //result["wiki"] = wiki;
                Collaborators.scope({method: ["allCollaboratorsFor", id]}).all()

                .then((collaborators) => {
                result["collaborators"] = collaborators;
                //console.log(result);
                callback(null, wiki);
                })
                .catch((err) => {
                    callback(err);
                })
            }
        })
    },

    addWiki(newWiki, callback){
        return Wiki.create(newWiki)
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },
    
    deleteWiki(id, callback){
        return Wiki.destroy({
            where: {id}
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },

    updateWiki(id, updatedWiki, callback){
        return Wiki.findById(id)
        .then((wiki) => {
            if(!wiki){
                return callback("Wiki not found");
            }

            wiki.update(updatedWiki, {
                fields: Object.keys(updatedWiki)
            })
            .then(() => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            });
        });
    },

    userPublic(id) {
        return Wiki.all()
        .then((wikis) => {
            wikis.forEach((wiki) => {
                if(wiki.userId == id && wiki.private === true){
                    wiki.update({private: false})
                }
            })
        })
        .catch((err) => {
            callback(err);
        })
    } 
}