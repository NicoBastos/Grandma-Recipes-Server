const mongoose = require("mongoose");

const MONGOURI =
  "mongodb+srv://NickB:Alicante800!@grandmacluster.yfe1u.mongodb.net/GrandmaRecipes?retryWrites=true&w=majority";

const startDB = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("databse connection!!");
  } catch (e) {
    console.log(e, "db error");
    throw e;
  }
};

module.exports = startDB;
