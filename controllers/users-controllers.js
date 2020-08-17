const HttpErorr = require("../util/http-error");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../schemas/userSchema");
const getAllUsers = async (req, res, _) => {
  const users = await User.find();
  res.status(200).json({ users });
};
const getUserByEmail = async (req, res) => {
  const email = req.params.ue;
  User.findOne({ email }, (err, acc) => {
    if (err) return res.status(400).json(err);

    acc = acc.toObject();
    delete acc.password;
    delete acc.__v;
    delete acc._id;
    res.status(200).json(acc);
  });
};
const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid data", errors });
  }

  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(4);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    let newUser = await User.findOne({ email });
    if (newUser) return res.status(400).json({ msg: "User Already Exists" });
    newUser = new User({
      username,
      email,
      password: hashedPassword,
      created: Date.now(),
    });

    await newUser.save();

    const payload = {
      user: {
        id: newUser.id,
      },
    };

    jwt.sign(payload, "rubikscube", { expiresIn: "15m" }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ newUser: newUser.id, token: token });
    });
  } catch (e) {
    console.log(e);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "User not found!" });
  } else {
    user = user.toObject();
    const passwordIsValid = await bcrypt.compare(password, user.password);
    // console.log("password valid?", user.password);
    if (!passwordIsValid) {
      res
        .status(400)
        .json({ message: "Email and password combination is wrong" });
    }
  }
  const payload = {
    user: {
      id: user._id,
    },
  };

  jwt.sign(payload, "rubikscube", { expiresIn: "15m" }, (error, token) => {
    if (error) {
      res.status(400).json({ message: "Possibly invalid token", error });
    }
    res.status(200).json({ token: token });
  });
};
const deleteUser = async (req, res, next) => {
  const email = req.params.ue;
  const user = User.findOne({ email });
  await User.deleteOne(user);
  return res.status(200).json({ message: "User deleted" });
};

module.exports = [
  getAllUsers,
  createUser,
  loginUser,
  deleteUser,
  getUserByEmail,
];
