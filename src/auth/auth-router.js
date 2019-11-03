const express = require("express");

const authRouter = express.Router();

authRouter.post("/", (req, res, next) => {
  res.send("ok");
});

module.exports = authRouter;
