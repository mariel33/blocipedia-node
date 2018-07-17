'use strict';

const faker = require("faker");

let users = [{
    id: 4,
    username: "johnDoe1",
    email: "johndoe@example.com",
    password: "password",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard"
  },
  {
    id: 12,
    username: "janeDoe1",
    email: "janedoe@example.com",
    password: "password",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard"
  },
  {
    id: 6,
    username: "meredith1",
    email: "meredithgrey@example.com",
    password: "password",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard"
  }
]


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', users, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
