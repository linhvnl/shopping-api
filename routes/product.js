// PACKAGE - MODELS - MIDDLEWARES - CONTROLLERS
const express = require("express");

const productController = require("../controllers/product");

// CREATE ROUTER
const router = express.Router();

// ROUTERS
// PRODUCTS > GET > PRODUCTS
router.get("/", productController.getProducts);

// PRODUCTS > GET > DETAIL PRODUCT AND RELATED PRODUCTS (SAME CATEGORY)
router.get("/:productId", productController.getProductAndRelated);

// EXPORT
module.exports = router;
