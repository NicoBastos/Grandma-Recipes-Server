const HttpErorr = require("../util/http-error");
const { v4: uuid } = require("uuid");
const axios = require("axios");
// const bcrypt = require("bcrypt");
const path = require("path");
// const { Tagger } = require("../ingredient-phrase-tagger/src/index");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Recipe = require("../schemas/recipeSchema");
const User = require("../schemas/userSchema");
const getAllRecipes = async (req, res, _) => {
  const recipes = await Recipe.find();
  res.status(200).json({ recipes });
};

const getUserRecipes = async (req, res, _) => {
  const username = req.params.un;
  const creator = await User.findOne({ username });
  let recipes;
  await Recipe.find({ creator }, (error, response) => {
    if (error) {
      res
        .status(400)
        .json({ message: "Could not find recipes by this person" });
    }

    console.log("recipes!", response);
    recipes = response;
  });
  res.status(200).json(recipes);
  //TODO change logic here if you want to add private recipes
};

const createRecipe = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (errors) return res.status(400).json(errors);
  const jwtToken = req.header("Authorization").split(" ")[1];
  let decodedPayload;
  jwt.verify(jwtToken, "rubikscube", (error, response) => {
    if (error) {
      throw error;
    }
    decodedPayload = response;
  });
  const _id = decodedPayload.user.id;
  const { title, description, ingredients, photoURL } = req.body;

  let creator = await User.findOne({ _id });
  if (!creator) {
    res.status(400).json({ message: "User not found!" });
  } else {
    creator = creator.toObject();
    delete creator.password;
  }

  let recipe;
  if (photoURL) {
    recipe = new Recipe({ title, description, ingredients, creator, photoURL });
  } else {
    recipe = new Recipe({ title, description, ingredients, creator });
  }
  try {
    await recipe.save();
    res.status(201).json({ message: "Recipe succesfully created", recipe });
  } catch (e) {
    return res.status(400).json(e);
  }
};

const updateRecipe = async (req, res, next) => {};
const deleteRecipe = async (req, res, next) => {
  const recipeID = req.params.ri;
  const jwtToken = req.header("Authorization").split(" ")[1];
  let _id;
  jwt.verify(jwtToken, "rubikscube", (error, response) => {
    if (error) throw error;
    _id = response;
    _id = _id.user.id;
  });

  let recipe = Recipe.findOne({ recipeID });
  recipe = recipe.toObject();
  if (_id === recipe.creator._id) {
    try {
      await Recipe.findByIdAndDelete({ recipe });
    } catch (e) {
      throw e;
    }
  }
};
module.exports = [
  getAllRecipes,
  createRecipe,
  getUserRecipes,
  deleteRecipe,
  updateRecipe,
];
