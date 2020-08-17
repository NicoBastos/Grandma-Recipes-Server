const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  id: Number,
  title: {
    type: String,
    require: [true, "Username is required"],
  },
  description: {
    type: String,
    require: [true, "email is required"],
  },
  ingredients: {
    type: Object,
    require: [true, "Password is required"],
  },
  creator: {
    type: Object,
    require: [true, "Creator account info is required"],
  },
  photoURL: {
    type: String,
  },
});
const Recipe = mongoose.model("recipe", recipeSchema);
module.exports = Recipe;
