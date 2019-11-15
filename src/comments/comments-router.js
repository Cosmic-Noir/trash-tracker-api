const express = require("express");
const path = require("path");
const CommentsService = require("./comments-service");
const { requireAuth } = require("../auth/jwt-auth");

const commentsRouter = express.Router();
const jsonParser = express.json();

commentsRouter.route("/").post(requireAuth, jsonParser, (req, res, next) => {
  console.log(req.body);

  const { site_id, content } = req.body;
  const newComment = { site_id, content };

  newComment.user_ref = req.user_ref;
  console.log(newComment);

  for (const [key, value] of Object.entries(newComment)) {
    if (value == null) {
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      });
    }
  }

  CommentsService.insertComment(req.app.get("db"), newComment)
    .then(comment => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${comment.id}`))
        .json(comment);
    })
    .catch(next);
});

commentsRouter.route("/:comment_id").delete((req, res, next) => {
  CommentsService.deleteComment(req.app.get("db"), req.params.comment_id)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

module.exports = commentsRouter;
