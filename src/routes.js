const express = require("express");

const routes = express.Router();

const views = __dirname + "/views/";

const profile = {
  name: "Levi",
  avatar: "https://avatars.githubusercontent.com/u/62621313?v=4",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
};

routes.get("/", (request, res) => res.render(views + "index"));

routes.get("/job", (request, res) => res.render(views + "job"));

routes.get("/jobedit", (request, res) => res.render(views + "job-edit"));

routes.get("/profile", (request, res) =>
  res.render(views + "profile", { profile })
);

module.exports = routes;
