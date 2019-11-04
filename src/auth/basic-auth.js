const AuthService = require("./auth-service.js");

function requireAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";

  let token;

  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing auth token " });
  } else {
    token = authToken.slice("bearer ".length, authToken.length);
  }

  const [tokenUserName, tokenPass] = AuthService.parseToken(token);

  if (!tokenUserName || !tokenPass) {
    return res.status(401).json({ error: "Unauthorized Request" });
  }

  AuthService.getUser(req.app.get("db"), tokenUserName)
    .then(user => {
      if (!user || user.pass !== tokenPass) {
        return res.status(401).json({ error: "Unauthorized Request" });
      }
      next();
    })
    .catch(next);
}

module.exports = {
  requireAuth
};
