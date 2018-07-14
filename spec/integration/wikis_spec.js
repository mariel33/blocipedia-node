const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : wikis", () => {
    beforeEach((done) => {
        this.user;
        this.wiki;

        sequelize.sync({ force: true }).then((res) => {

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
                            this.wiki = wiki;
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                });
        });
    });

    describe("GET /wikis/new", () => {
        it("should render a view with a new wiki form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
            });
        });
    });

    describe("POST /wikis/create", () => {
        const options = {
            url: `${base}/create`,
            form: {
                title: "First Wiki",
                body: "Creating my first Wiki",
                private: false,
                userId: this.user.id
            }
        }
        it("should create a new wiki and redirect", (done) => {
            request.post(options,
                (err, res, body) => {
                    Wiki.findOne({ where: { title: "First Wiki" } })
                        .then((wiki) => {
                            expect(res.statusCode).toBe(303);
                            expect(wiki.title).toBe("First Wiki");
                            expect(wiki.body).toBe("Creating my first Wiki");
                            expect(wiki.userId).not.toBeNull();
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        })
                })
        })
    })
});
