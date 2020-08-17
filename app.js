const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./util/http-error");
const cors = require("cors");
const usersRouter = require("./routes/users-routes");
const startDB = require("./db");
const recipesRouter = require("./routes/recipes-routes");
startDB();
const app = express();
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//The users route of the API to manage users.
app.use("/api/users", usersRouter);
//The recipes route of the API to manage recipes.
app.use("/api/recipes", recipesRouter);

//Incase the request is not part of the api, this will catch that error
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});
// If the headers of that request have been
// sent before, then throw error and go to next
// middleware. You dont want to respond twice
// to a request.
app.use((req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unkown error occured" });
});

//Starting server on port 4000;
const PORT = process.env.PORT || 5000;
app.listen(PORT);
