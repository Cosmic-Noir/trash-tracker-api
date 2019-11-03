const express = require("express");
const jsonParser = express.json();

const authRouter = express.Router();

authRouter.post("/", jsonParser, (req, res, next) => {
  const { username, pass } = req.body;
  const loginUser = { username, pass };

  for (const [key, value] of Object.entries(loginUser)) {
    if (value == null) {
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      });
    }
  }

  res.send("ok");
});

module.exports = authRouter;
