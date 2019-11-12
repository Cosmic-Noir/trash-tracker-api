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

  context(`Given there are clean sites`, () => {
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

    it(`GET /api/sites/clean responds with 200 and clean sites`, () => {
      return supertest(app)
        .get("/api/sites/clean")
        .expect(200, testCleanSites);
    });
  });
});

describe(`GET /api/sites/:site_id`, () => {
  context(`Given site does not exist`, () => {
    it(`Responds with 404`, () => {
      const invalidId = 123454;
      return supertest(app)
        .get(`/api/sites/${invalidId}`)
        .expect(404, { error: { message: `Site doesn't exist` } });
    });
  });

  context(`Given the site does exist`, () => {
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

    it(`Responds with 200 and returns the specified site`, () => {
      const siteId = 2;
      const expectedSite = testTrashSites[siteId - 1];
      return supertest(app)
        .get(`/api/sites/${siteId}`)
        .expect(200, expectedSite);
    });
  });
});
