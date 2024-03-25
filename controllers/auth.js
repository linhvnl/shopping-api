// PACKAGE - MODELS - HELPER
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const createUserName = require("../utils/helper").createUserName;

// EXPORT CONTROLERS
// AUTH > CLIENT > POST > SIGN UP
module.exports.postSignup = async (req, res, next) => {
  try {
    // request > body/ query/ params
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    // create a userName from fullName
    const userName = createUserName(fullName);

    // check user exists
    const exUser = await User.findOne({ email });

    if (exUser) {
      return res.status(401).json({
        message: "Unauthenticated!",
        dataError: [{ msg: "Email already exists! Please enter another!" }],
      });
    }

    // hash password
    const hashedPw = await bcrypt.hash(password, 12);

    // create new user
    const user = new User({
      fullName,
      email,
      password: hashedPw,
      phoneNumber,
      userName,
    });

    await user.save();

    return res.status(201).json({ message: "User created!" });

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// AUTH > CLIENT > POST > LOGIN > FOR USER
module.exports.postLogin = async (req, res, next) => {
  try {
    // request > body/ query/ params
    const email = req.body.email;
    const password = req.body.password;

    // check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Unauthenticated!",
        dataError: [{ msg: "Email or Password is incorrect!" }],
      });
    }

    // check password
    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch)
      return res.status(401).json({
        message: "Unauthenticated!",
        dataError: [{ msg: "Email or Password is incorrect!" }],
      });

    // next middleware
    req.user = user;
    next();

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// AUTH > POST > LOGIN > FOR ADMIN
module.exports.setTokenToUser = async (req, res, next) => {
  try {
    // get user
    const user = req.user;

    // create token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES * 60 * 60,
      }
    );

    // exprire time
    const expires = new Date(
      Date.now() + process.env.JWT_EXPIRES * 60 * 60 * 1000
    );

    // response login success
    return res.status(200).json({
      message: "User logined!",
      data: {
        token,
        expires,
        userName: user.userName,
        role: user.role,
      },
    });

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};
