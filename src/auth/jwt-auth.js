const AuthService = require("./auth-service.js");

// Responsible for validating JWT
function requireAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";

  let token;

  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing auth token " });
  } else {
    token = authToken.slice(7, authToken.length);
  }

  try {
    const payload = AuthService.verifyToken(token);

    AuthService.getUser(req.app.get("db"), payload.sub)
      .then(user => {
        if (!user) {
          return res
            .status(401)
            .json({ error: "Unauthorized request Invalid user" });
        }
        req.user_ref = user.id;
        next();
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized Request" });
  }
}

module.exports = {
  requireAuth
};
