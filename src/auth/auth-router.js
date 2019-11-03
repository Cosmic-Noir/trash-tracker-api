const express = require("express");
const jsonParser = express.json();
const authRouter = express.Router();
const AuthService = require("./auth-service");

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
  AuthService.getUser(req.app.get("db"), loginUser.username)
    .then(dbUser => {
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect username or password"
        });
      return AuthService.comparePasswords(loginUser.pass, dbUser.pass).then(
        compareMatch => {
          if (!compareMatch) {
            return res.status(400).json({
              error: "Incorrect username or password"
            });
          }
          res.send("ok");
        }
      );
    })
    .catch(next);
});

module.exports = authRouter;
