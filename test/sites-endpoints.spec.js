const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const {
  makeTrashSitesArray,
  makeCleanSitesArray,
  makeUsersArray
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
  db.raw("TRUNCATE tt_sites, tt_users RESTART IDENTITY CASCADE")
);
afterEach("Cleanup", () =>
  db.raw("TRUNCATE tt_sites, tt_users RESTART IDENTITY CASCADE")
);

// GET endpoints
describe("GET /api/trash", function() {
  context(`Given there are no trash sites`, () => {
    it("Responds with 200 status and empty list", () => {
      return supertest(app)
        .get("/api/sites/trash")
        .expect(200, []);
    });
  });

  context(`Given there are trash sites`, () => {
    const testUsers = makeUsersArray();
    const testTrashSites = makeTrashSitesArray();
    const testCleanSites = makeCleanSitesArray();

    beforeEach("Insert users and sites", () => {
      return db
        .into("tt_users")
        .insert(testUsers)
        .then(() => {
          return db.into("tt_sites").insert(testTrashSites);
        })
        .then(() => {
          return db.into("tt_sites").insert(testCleanSites);
        });
    });

    it(`GET /api/sites/trash responds with 200 and trash sites`, () => {
      return supertest(app)
        .get("/api/sites/trash")
        .expect(200, testTrashSites);
    });
  });
});

describe("GET /api/clean", function() {
  context(`Given there are no clean sites`, () => {
    it("Responds with 200 status and empty list", () => {
      return supertest(app)
        .get("/api/sites/clean")
        .expect(200, []);
    });
  });
});
