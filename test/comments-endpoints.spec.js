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

describe("GET /api/sites/${siteId}/comments ", function() {
  context(`Given there are no comments`, () => {
    const testUsers = makeUsersArray();
    const testSites = makeTrashSitesArray();

    beforeEach("Insert users and sites", () => {
      return db
        .into("tt_users")
        .insert(testUsers)
        .then(() => {
          return db.into("tt_sites").insert(testSites);
        });
    });

    it(`Responds with 200 status and empty list`, () => {
      return supertest(app)
        .get(`/api/sites/${testSites[0].id}/comments`)
        .expect(200, []);
    });
  });
});
