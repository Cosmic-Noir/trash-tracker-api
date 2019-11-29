require("dotenv").config();
const express = require("express");
const { NODE_ENV } = require("./config");

/* Middleware */
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

/* Routers */
const authRouter = require("./auth/auth-router");
const commentsRouter = require("./comments/comments-router");
const sitesRouter = require("./sites/sites-router");
const usersRouter = require("./users/users-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

/* Middleware use methods before Routers */
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// Return 500 for internal server errors
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

// Test Endpoint
app.get("/", (req, res) => {
  res.send("Hello, boilerplate!");
});

// Routers
app.use("/api/sites", sitesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", authRouter);
app.use("/uploads", express.static("uploads"));

module.exports = app;
