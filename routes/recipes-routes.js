const express = require("express");
const { check } = require("express-validator");
const recipesRouter = express.Router();
const [
  getAllRecipes,
  createRecipe,
  getUserRecipes,
  deleteRecipe,
  updateRecipe,
] = require("../controllers/recipes-controllers");
recipesRouter.get("/", getAllRecipes);
recipesRouter.get("/:ue", getUserRecipes);
recipesRouter.post("/", createRecipe);
recipesRouter.put("/login", updateRecipe);
recipesRouter.delete("/:ue", deleteRecipe);

module.exports = recipesRouter;
