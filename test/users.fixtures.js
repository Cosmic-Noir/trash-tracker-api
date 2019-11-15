const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../src/config");

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
    },
    {
      id: 3,
      username: "stargirl",
      email: "coolest123@email.com",
      pass: "$2a$12$5lZIXjUpKOe04nWlp7/0POl0Be2AGMhAnk9/oBXf7kdz57T8BgQrO"
    }
  ];
}

function makeAuthHeader(user, secret = config.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: "HS256"
  });
  //   console.log(`bearer ${token}`);
  return `bearer ${token}`;
}

module.exports = { makeUsersArray, makeAuthHeader };
