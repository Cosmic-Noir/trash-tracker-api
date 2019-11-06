require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

// Routes
const sitesRouter = require("./sites/sites-router");
const commentsRouter = require("./comments/comments-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

// Middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(epxress.static("uploads"));

// Return 500 for internal server errors
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

// Endpoints
app.get("/", (req, res) => {
  res.send("Hello, boilerplate!");
});

// Routers
app.use("/api/sites", sitesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", authRouter);

module.exports = app;
