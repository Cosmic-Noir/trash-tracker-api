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

describe("GET /api/sites/${siteId}/comments", function() {
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

  context(`Given there are comments for an existing site`, () => {
    const testUsers = makeUsersArray();
    const testSites = makeTrashSitesArray();
    const testComments = makeCommentsArray();
    const exptectedComment = {
      id: 4,
      date_posted: new Date().toISOString(),
      username: "dude",
      content:
        "I think some friends are going to meet here Friday after school if anyone wants to help. 3PM"
    };

    beforeEach(`Insert users and sites`, () => {
      return db
        .into("tt_users")
        .insert(testUsers)
        .then(() => {
          return db.into("tt_sites").insert(testSites);
        })
        .then(() => {
          return db.into("tt_comments").insert(testComments);
        });
    });

    it(`Responds with 200 status and corresponding comments`, () => {
      return supertest(app)
        .get(`/api/sites/${testSites[1].id}/comments`)
        .expect(200, [exptectedComment]);
    });
  });

  context(`Given a comment with XSS attack`, () => {});
});
