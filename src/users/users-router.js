const express = require("express");
const path = require("path");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/", jsonParser, (req, res, next) => {
  const { user_name, pass, email } = req.body;

  for (const field of ["pass", "user_name", "email"]) {
    if (!req.body[field]) {
      return res.status(400).json({
        error: `Missing ${field} in request body`
      });
    }
  }
  // Validate password
  const passError = UsersService.validatePassword(pass);
  // Return if error
  if (passError) {
    return res.status(400).json({ error: passError });
  }

  // Check if user_name taken
  UsersService.userNameExist(req.app.get("db"), user_name).then(
    userNameExist => {
      if (userNameExist) {
        return res.status(400).json({ error: `User name already taken` });
      }
    }
  );

  // If username not taken and pass validation passes, hash password and create new user
  return UsersService.hashPassword(pass)
    .then(hashedPass => {
      const newUser = {
        user_name,
        pass: hashedPass,
        email,
        date_joined: "now()"
      };
      // Post new valid user to db
      return UsersService.insertUser(req.app.get("db"), newUser).then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`));
      });
    })
    .catch(next);
});

module.exports = usersRouter;
