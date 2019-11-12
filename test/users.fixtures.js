const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      username: "dude",
      email: "cool@email.com",
      pass: "cool123",
      score: 25
    },
    {
      id: 2,
      username: "dudette",
      email: "cooler@email.com",
      pass: "cold789"
    }
  ];
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256"
  });
  return `bearer ${token}`;
}

module.exports = { makeUsersArray, makeAuthHeader };
