const Collaborators = require("./models").Collaborators;
const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/application");

module.exports = {

    add(req, callback){
        User.findAll({
            where: {
                username: req.body.collaborators
            }
        })
        .then((users) => {
            if(!users[0]){
                return callback("user not found");
            }
            Collaborators.findAll({
                where: {
                    userId: users[0].id,
                    wikiId: req.params.wikiId
                }
            })
            .then((collaborators) => {
                if(collaborators.length != 0){
                    return callback(`${req.body.collaborators} is already a collaborator`);
                }
                let newCollaborator = {
                    userId: users[0].id,
                    wikiId: req.params.wikiId
                };
                return Collaborators.create(newCollaborator)
                .then((collaborators) => {
                    callback(null, collaborator);
                })
                .catch((err) => {
                    callback(err, null);
                })
            })
            .catch((err) => {
                callback(err, null);
            })
        })
        .catch((err) => {
            callback(err, null);
        })
    },

    delete(req, callback) {
        let collaboratorId = req.body.collaborator;
        let wikiId = req.params.wikiId;
        const authorized = new Authorizer(req.user, wiki, collaboratorId).destroy();
        if(authorized){
            Collaborator.destroy({ where: {
                userId: collaboratorId,
                wikiId: wikiId
            }})
            .then((deletedRecordsCount) => {
                callback(null, deletedRecordsCount);
            })
            .catch((err) => {
                callback(err);
            });
        } else {
            req.flash("notice", "You are not authorized to do that");
            callback(err);
        }
    }

}