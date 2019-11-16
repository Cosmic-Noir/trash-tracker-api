const express = require("express");
const path = require("path");
const xss = require("xss");
const SitesService = require("./sites-service");
const { requireAuth } = require("../auth/jwt-auth");

// Cloudinary
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "trash-tracker",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer
const multer = require("multer");
const storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // filter for img file types
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

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
  before_img: site.before_img,
  after_img: site.after_img,
  content: xss(site.content),
  clean: site.clean
});

// Obtain only clean sites from db:
sitesRouter.route("/clean").get((req, res, next) => {
  SitesService.getCleanSites(req.app.get("db"))
    .then(sites => {
      res.json(sites.map(sterilizedSite));
    })
    .catch(next);
});

//Obtain only trashed sites from db:
sitesRouter.route("/trash").get((req, res, next) => {
  SitesService.getTrashSites(req.app.get("db"))
    .then(sites => {
      res.json(sites.map(sterilizedSite));
    })
    .catch(next);
});

// All
sitesRouter
  .route("/")
  .get((req, res, next) => {
    SitesService.getAllSites(req.app.get("db"))
      .then(sites => {
        res.json(sites.map(sterilizedSite));
      })
      .catch(next);
  })
  .post(
    requireAuth,
    jsonParser,
    upload.single("before_img"),
    (req, res, next) => {
      // First check if image is missing
      // if (req.body.before_img === null) {
      //   return res.status(400).json({
      //     error: { message: `Missing 'before_img' in request body` }
      //   });
      // }

      const { title, addrss, city, state_abr, content } = req.body;
      const newSite = {
        title,
        addrss,
        city,
        state_abr,
        content
      };

      // Check for other missing fields and then post new site once image file has been handled
      insertSite = () => {
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
      };

      if (typeof req.body.before_img === "string") {
        newSite.before_img = req.body.before_img;
        insertSite();
      } else {
        cloudinary.uploader.upload(req.file.path, function(error, result) {
          newSite.before_img = result.secure_url;
          insertSite();
        });
      }

      newSite.posted_by = req.user_ref;
    }
  );

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
  .patch(jsonParser, upload.single("after_img"), (req, res, next) => {
    const { content, clean } = req.body;
    const siteToUpdate = { content, clean };

    updateSite = () => {
      SitesService.updateSite(
        req.app.get("db"),
        req.params.site_id,
        siteToUpdate
      )
        .then(numberRowsAffect => {
          res.status(204).end();
        })
        .catch(next);
    };

    if (typeof req.body.after_img !== "string") {
      cloudinary.uploader.upload(req.file.path, function(error, result) {
        siteToUpdate.after_img = result.secure_url;
        updateSite();
      });
    } else {
      siteToUpdate.after_img = req.body.after_img;
      updateSite();
    }

    const numberOfValues = Object.values(siteToUpdate).filter(Boolean).length;

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain new content and updated Image`
        }
      });
    }
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
