const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {

    beforeEach((done) => {
        this.wiki;
        this.user;

        sequelize.sync({ force: true }).then((res) => {

            User.create({
                username: "starman",
                email:"starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

                Wiki.create({
                    title: "Expeditions to Alpha Centauri",
                    body: "A compilation of reports from recent visits to the star system.",
                    private: false,
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                });
        
            });
        });
    });

    describe("#create()", () => {

        it("should create a wiki objec with a title, body, and assigned user", (done) => {
            Wiki.create({
                title: "My first visit to Proxima Centauri b",
                body: "I saw some rocks.",
                userId: this.user.id
            })
            .then((wiki) => {
                expect(wiki.title).toBe("My first visit to Proxima Centauri b");
                expect(wiki.body).toBe("I saw some rocks.");
                expect(wiki.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#setUser()", () => {

        it("should associate a wiki and a user together", (done) => {
            User.create({
                username: "adaexample",
                email: "ada@example.com",
                password: "password"
            })
            .then((newUser) => {
                expect(this.wiki.userId).toBe(this.user.id);
                this.wiki.setUser(newUser)
                .then((wiki) => {
                    expect(this.wiki.userId).toBe(newUser.id);
                    done();
                });
            });
        });
    });

    describe("#getUser()", () => {

        it("should return the associated wiki", (done) => {

            this.wiki.getUser()
            .then((associateUser) => {
                expect(associateUser.email).toBe("starman@tesla.com");
                done();
            });
        });
    });
});