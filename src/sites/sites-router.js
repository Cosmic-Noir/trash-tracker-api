const express = require("express");
const path = require("path");
const xss = require("xss");
const SitesService = require("./sites-service");

const sitesRouter = express.Router();
const jsonParser = express.json();

// sterilized site:
const sterilizedSite = site => ({
  id: site.id,
  posted_by: site.posted_by,
  date_posted: site.date_posted,
  title: xss(site.title),
  addrss: xss(site.addrss),
  city: xss(site.city),
  state_abr: site.state_abr,
  // Will need to change
  before_img: site.before_img,
  after_img: site.after_img,
  content: xss(site.content),
  clean: site.clean
});

// Obtain only clean sites from db:
sitesRouter.route("/clean").get((req, res, next) => {
  SitesService.getCleanSites(req.app.get("db"))
    .then(sites => {
      res.json(sites);
    })
    .catch(next);
});

//Obtain only trashed sites from db:
sitesRouter.route("/trash").get((req, res, next) => {
  SitesService.getTrashSites(req.app.get("db"))
    .then(sites => {
      res.json(sites);
    })
    .catch(next);
});

// All
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
      posted_by,
      title,
      addrss,
      city,
      state_abr,
      before_img,
      content
    } = req.body;
    const newSite = {
      posted_by,
      title,
      addrss,
      city,
      state_abr,
      before_img,
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

// By Id
sitesRouter
  .route("/:site_id")
  .all(checkSiteExists)
  .get((req, res, next) => {
    res.json(sterilizedSite(res.site));
  })
  .delete((req, res, next) => {
    SitesService.deleteSite(req.app.get("db"), req.params.site_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { content, after_img, clean } = req.body;
    const siteToUpdate = { content, after_img, clean };

    const numberOfValues = Object.values(siteToUpdate).filter(Boolean).length;

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain new content and updated Image`
        }
      });
    }

    SitesService.updateSite(req.app.get("db"), req.params.site_id, siteToUpdate)
      .then(numberRowsAffect => {
        res.status(204).end();
      })
      .catch(next);
  });

// Obtain comments for site:
sitesRouter
  .route("/:site_id/comments/")
  .all(checkSiteExists)
  .get((req, res, next) => {
    SitesService.getCommentsForSite(req.app.get("db"), req.params.site_id)
      .then(comments => {
        res.json(comments);
      })
      .catch(next);
  });

// Async - check site exists
async function checkSiteExists(req, res, next) {
  try {
    const site = await SitesService.getById(
      req.app.get("db"),
      req.params.site_id
    );

    if (!site)
      return res.status(404).json({
        error: { message: `Site doesn't exist` }
      });

    res.site = site;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = sitesRouter;
