const express = require("express");
const path = require("path");
const xss = require("xss");
const SitesService = require("./sites-service");

const sitesRouter = express.Router();
const jsonParser = express.json();

// sterilized site:
const sterilizedSite = site => ({
  id: site.id,
  postedby: site.postedby,
  date_posted: site.date_posted,
  title: xss(site.title),
  addrss: xss(site.addrss),
  city: xss(site.city),
  stateAbr: site.stateAbr,
  // Will need to change
  beforeimg: site.beforeimg,
  afterImg: site.afterImg,
  content: xss(site.content),
  clean: site.clean
});

sitesRouter
  .route("/")
  .get((req, res, next) => {
    SitesService.getAllSites(req.app.get("db"))
      .then(sites => {
        res.json(sites);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      postedby,
      title,
      addrss,
      city,
      stateAbr,
      beforeimg,
      content
    } = req.body;
    const newSite = {
      postedby,
      title,
      addrss,
      city,
      stateAbr,
      beforeimg,
      content
    };

    for (const [key, value] of Object.entries(newSite)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    SitesService.insertSite(req.app.get("db"), newSite)
      .then(site => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${site.id}`))
          .json(sterilizedSite(site));
      })
      .catch(next);
  });

module.exports = sitesRouter;
