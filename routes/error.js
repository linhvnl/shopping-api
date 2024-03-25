// PACKAGE - MODELS - MIDDLEWARES - CONTROLLERS
const express = require("express");

const errorController = require("../controllers/error");

// CREATE ROUTER
const router = express.Router();

// ROUTERS
// ROUTE NOT FOUND
router.use(errorController.get404);

// EXPORT
module.exports = router;
