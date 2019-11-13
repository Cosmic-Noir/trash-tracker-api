const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      username: "dude",
      email: "cool@email.com",
      pass: "$2a$12$5lZIXjUpKOe04nWlp7/0POl0Be2AGMhAnk9/oBXf7kdz57T8BgQrO",
      score: 25
    },
    {
      id: 2,
      username: "dudette",
      email: "cooler@email.com",
      pass: "$2a$12$C/Ftm/O3HQ.cQjrerANQAu06GvCdksfuxG5QoninrIktokcFZPVS."
    }
  ];
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: "HS256"
  });
  return `bearer ${token}`;
}

module.exports = { makeUsersArray, makeAuthHeader };
