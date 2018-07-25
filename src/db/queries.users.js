const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Collaborators = require("./models").Collaborators;


module.exports = {
    createUser(newUser, callback) {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            const sgMail = require("@sendgrid/mail");
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: newUser.email,
                from: 'donotreply@blocipedia.com',
                subject: 'Blocipedia Account Confirmation',
                text: 'Thank you for creating a Blocipedia account!',
                html: '<strong>Log in now to start contributing!</strong>',
              };
              sgMail.send(msg);
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getUser(id, callback){
        let result = {};
        User.findById(id)
        .then((user) => {
            if(!user) {
                callback(404)
            } else {
                result["user"] = user;
                Collaborators.scope({ method: ["allCollaborationsFor", id]}).all()
                .then((collaborations) => {
                    result["collaborations"] = collaborations;
                    callback(null, result)
                })
                .catch((err) => {
                    callback(err);
                })
            }
        })
    }
}