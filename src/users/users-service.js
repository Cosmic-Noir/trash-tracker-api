const xss = require("xss");
const bcrypt = require("bcryptjs");

const regReq = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  userNameExist(knex, user_name) {
    return (
      knex
        .select("tt_users")
        .where({ user_name })
        .first()
        // Should return false if user_name already exists
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
  hasPassword(pass) {
    return bcrypt.has(pass, 12);
  },
  sterilizedUser(user) {
    return {
      id: user.id,
      user_name: xss(user.userName),
      email: xss(user.email),
      date_joined: new Date(user.date_joined)
    };
  }
};
