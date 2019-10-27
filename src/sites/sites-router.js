const express = require("express");
const SitesService = require("./sites-service");

const sitesRouter = express.Router();
const jsonParser = express.json();

sitesRouter.route("/").get((req, res, next) => {
  SitesService.getAllSites(req.app.get("db"))
    .then(sites => {
      res.json(sites);
    })
    .catch(next);
});

module.exports = sitesRouter;
