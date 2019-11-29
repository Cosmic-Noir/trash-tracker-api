require("dotenv").config();
const knex = require("knex");
const app = require("./app");
const { PORT, DATABASE_URL } = require("./config");

// Connect to DATABASE specified in config/env
const db = knex({
  client: "pg",
  connection: DATABASE_URL
});

// Set the attribute db equal to database connection via knex
app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
