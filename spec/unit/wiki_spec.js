const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {

    beforeEach((done) => {

        this.user;
        this.wiki;
        sequelize.sync({ force: true })
            .then(() => {
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    });

    describe("#create()", () => {
        it("should create a Wiki object with a valid title and body", (done) => {
            Wiki.create({
                title: "First Wiki",
                body: "Creating my first Wiki",
                private: false
            })
                .then((wiki) => {
                    expect(wiki.title).toBe("First Wiki");
                    expect(wiki.body).toBe("Creating my first Wiki");
                    expect(wiki.private).toBe(false);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

        it("should not create a wiki with missing title, body or signed in user", (done) => {
            Wiki.create({
                title: "First Wiki"
            })
                .then((wiki) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Wiki.body cannot be null");
                    expect(err.message).toContain("Wiki.userId cannot be null");
                    done();
                });
        });

    });

    describe("#setUser()", () => {

        it("should associate a user and a wiki together", (done) => {
            User.create({
                username: "testUser",
                email: "user@test.com",
                password: "password"
            })
                .then((user) => {
                    this.user = user;

                    Wiki.create({
                        title: "First Wiki",
                        body: "Creating my first Wiki",
                        private: false,
                        userId: this.user.id
                    })
                        .then((wiki) => {
                            expect(wiki.userId).toBe(this.user.id);
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        })
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });

});

