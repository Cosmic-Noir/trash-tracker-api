const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const {
  makeTrashSitesArray,
  makeCleanSitesArray,
  makeMaliciousSite
} = require("./sites.fixtures");
const { makeUsersArray, makeAuthHeader } = require("./users.fixtures");

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

describe(`GET /api/sites`, () => {
  context(`Given a site with XSS attack`, () => {
    const { maliciousSite, expectedSite } = makeMaliciousSite();
    const testUsers = makeUsersArray();

    beforeEach(`Insert malicious site`, () => {
      return db
        .into("tt_users")
        .insert(testUsers)
        .then(() => {
          return db.into("tt_sites").insert(maliciousSite);
        });
    });

    it(`Sanitizes the site data of XSS attack`, () => {
      return supertest(app)
        .get(`/api/sites`)
        .expect(200)
        .expect(res => {
          expect(res.body[0].title).to.eql(expectedSite.title);
          expect(res.body[0].content).to.eql(expectedSite.content);
          expect(res.body[0].city).to.eql(expectedSite.city);
          expect(res.body[0].addrss).to.eql(expectedSite.addrss);
        });
    });
  });
});

// GET by ID
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

describe(`POST /api/sites`, () => {
  it(`Creates site, responds with 201 and new site`, function() {
    // this.retries(3);
    const testUsers = makeUsersArray();

    beforeEach("cleanup", () => {
      db.raw("TRUNCATE tt_sites, tt_users RESTART IDENTITY CASCADE");
    });
    beforeEach("Insert test users", () => {
      return db.into("tt_users").insert(testUsers);
    });

    const newSite = {
      posted_by: 2,
      title: "Leech Lake",
      addrss: "Leech Lake Park",
      city: "Pequot",
      state_abr: "MN",
      before_img:
        "https://www.pasadenastarnews.com/wp-content/uploads/2019/06/LDN-L-HOMELESS-COUNT-SGVN-0605-12-SR2.jpg?w=525",
      content: "One, two, testing..."
    };

    return supertest(app)
      .post(`/api/sites`)
      .set("Authorization", makeAuthHeader(testUsers[0]))
      .send(newSite)
      .expect(201)
      .expect(res => {
        expect(res.body.title).to.eql(newSite.title);
        expect(res.body.posted_by).to.eql(newSite.posted_by);
        expect(res.body.addrss).to.eql(newSite.addrss);
        expect(res.body.city).to.eql(newSite.city);
        expect(res.body.state_abr).to.eql(newSite.state_abr);
        expect(res.body.before_img).to.eql(newSite.before_img);
        expect(res.body.content).to.eql(newSite.content);
        expect(res.body).to.have.property("id");
        expect(res.headers.location).to.eql(`/api/sites/${res.body.id}`);
        const expected = new Date().toLocaleString();
        const actual = new Date(res.body.date_posted).toLocaleString();
        expect(actual).to.eql(expected);
      })
      .then(res => {
        supertest(app)
          .get(`/api/sites/${res.body.id}`)
          .expect(res.body);
      });
  });
});

describe.skip(`PATCH /api/sites/:site_id`, () => {
  context(`Given there are no matching sites`, () => {
    const siteId = 12345;
    return supertest(app)
      .patch(`/api/sites/${siteId}`)
      .expect(404, { error: { message: `Site doesn't exist` } });
  });

  context(`Given there is a matching site`, () => {
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

    it(`Responds with 204 and updates the site to clean`, () => {
      const idToUpdate = 1;
      const updatedSite = {
        content: "Yay we did it!",
        after_img:
          "https://res.cloudinary.com/trash-tracker/image/upload/v1573180117/tilpd3mwkehtvz24hzwz.jpg",
        clean: true
      };

      return supertest(app)
        .patch(`/api/sites/${idToUpdate}`)
        .send(updatedSite)
        .expect(204);
    });
  });
});
