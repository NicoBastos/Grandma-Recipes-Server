const express = require("express");
const { check } = require("express-validator");
const usersRouter = express.Router();
const [
  getAllUsers,
  createUser,
  loginUser,
  deleteUser,
  getUserByEmail,
] = require("../controllers/users-controllers");
usersRouter.get("/", getAllUsers);
usersRouter.get("/:ue", getUserByEmail);
usersRouter.post(
  "/",
  [
    check("username")
      .not()
      .isEmpty()
      .withMessage("You must provide a username"),
    check("email").not().isEmpty().isEmail().normalizeEmail(),
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .matches(/\d/)
      .withMessage(
        "must be at least 6 characters long, and it must contain a number"
      ),
  ],
  createUser
);
usersRouter.post(
  "/login",
  [
    check("email").not().isEmpty().withMessage("You must providea a username"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("you must provide a password"),
  ],
  loginUser
);
usersRouter.delete("/:ue", deleteUser);

module.exports = usersRouter;
