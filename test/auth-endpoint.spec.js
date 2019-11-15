const knex = require("knex");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const { makeUsersArray, makeAuthHeader } = require("./users.fixtures");
const {
  makeTrashSitesArray,
  makeCleanSitesArray,
  makeMaliciousSite
} = require("./sites.fixtures");

describe("Auth Endpoints", function() {
  let db;
});
