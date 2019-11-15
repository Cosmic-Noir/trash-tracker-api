const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const {
  makeMaliciousComment,
  makeCommentsArray
} = require("./comments.fixtures");
const { makeUsersArray, makeAuthHeader } = require("./users.fixtures");
const {
  makeTrashSitesArray,
  makeCleanSitesArray,
  makeMaliciousSite
} = require("./sites.fixtures");

let db;

// Create connection to test DB:

before("Make knex instance", () => {
  db = knex({
    client: "pg",
    connection: process.env.TEST_DB_URL
  });
  app.set("db", db);
});

// Disconnect and clear the table for testing
after("Disconnect from db", () => db.destroy());
before("Clear the table", () =>
  db.raw("TRUNCATE tt_comments, tt_sites, tt_users RESTART IDENTITY CASCADE")
);
afterEach("Cleanup", () =>
  db.raw("TRUNCATE tt_comments, tt_sites, tt_users RESTART IDENTITY CASCADE")
);

describe("Comments Endpoints", function() {});
