// PACKAGE - MODELS - MIDDLEWARES - CONTROLLERS
const express = require("express");

const authMiddleware = require("../middleware/checkAuth");
const validatorMiddleware = require("../middleware/validator");

const authController = require("../controllers/auth");

// CREATE ROUTER
const router = express.Router();

// ROUTERS
// AUTH > CLIENT > POST > SIGN UP
router.post(
  "/signup",
  validatorMiddleware.validateSignup,
  validatorMiddleware.useResult,
  authController.postSignup
);

// AUTH > POST > LOGIN > FOR ADMIN
router.post(
  "/login/admin",
  validatorMiddleware.validateLogin,
  validatorMiddleware.useResult,
  authController.postLogin,
  authMiddleware.verifyAdminAndCS,
  authController.setTokenToUser
);

// AUTH > CLIENT > POST > LOGIN > FOR USER
router.post(
  "/login",
  validatorMiddleware.validateLogin,
  validatorMiddleware.useResult,
  authController.postLogin,
  authController.setTokenToUser
);

// EXPORT
module.exports = router;
