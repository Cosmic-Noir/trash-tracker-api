module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL:
    process.env.DB_URL || "postgresql://dunder_mifflin@localhost/trash_tracker",
  TEST_DB_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://dunder_mifflin@localhost/trash_tracker-test",
  JWT_SECRET: process.env.JWT_SECRET || "my_super_secret"
};
