const xss = require("xss");
const bcrypt = require("bcryptjs");

const regReq = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  userNameExist(knex, username) {
    return (
      knex("tt_users")
        .where({ username })
        .first()
        // Should return false if username already exists
        .then(user => !!user)
    );
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("tt_users")
      .returning("*")
      .then(([user]) => user);
  },
  deleteUser(knex) {
    return knex("tt_users")
      .where({ id })
      .delete();
  },
  validatePassword(pass) {
    if (pass.length < 8) {
      return `Password must be at least 8 characters`;
    }
    if (pass.length > 72) {
      return `Password cannot be longer than 72 characters`;
    }
    if (!regReq.test(pass)) {
      return `Password must contain one upper case, lower case, number and special character`;
    }
    return null;
  },
  hashPassword(pass) {
    return bcrypt.hash(pass, 12);
  },
  sterilizedUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      email: xss(user.email),
      date_joined: new Date(user.date_joined)
    };
  }
};

module.exports = UsersService;
