// PACKAGE
const { check, body, validationResult } = require("express-validator");

// EXPORT MIDDLEWARE FUNCTION
module.exports.validateSignup = [
  body("fullName").trim().not().isEmpty(),
  body("email", "Please enter a valid email!")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "Password is min 8 characters!").trim().isLength({ min: 8 }),
  body("phoneNumber", "Please enter a valid phone number!").trim().isNumeric(),
];

// EXPORT MIDDLEWARE FUNCTION
module.exports.validateLogin = [
  body("email", "Please enter a valid email!")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "Password is min 8 characters!").trim().isLength({ min: 8 }),
];

// EXPORT MIDDLEWARE FUNCTION
module.exports.validateProduct = [
  body("name", "Name is not be empty!").trim().notEmpty(),
  body("category", "Category is not be empty!").trim().notEmpty(),
  body("short_desc", "Short-description is not be empty!").trim().notEmpty(),
  body("long_desc", "Long-description is not be empty!").trim().notEmpty(),
  body("price", "Price is be a number!").trim().isNumeric(),
  body("count", "Quantity of product is be a number!").trim().isNumeric(),
];

// EXPORT MIDDLEWARE FUNCTION
module.exports.useResult = async (req, res, next) => {
  try {
    // check validity
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: "Validation failed!", dataError: errors.array() });
    }

    next();

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};
