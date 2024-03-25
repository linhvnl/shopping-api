// PACKAGE - MODELS - MIDDLEWARES - CONTROLLERS
const express = require("express");

// const multerMiddleware = require("../middleware/multer");
const validatorMiddleware = require("../middleware/validator");

const adminController = require("../controllers/admin");

// CREATE ROUTER
const router = express.Router();

// ROUTERS
// ADMIN > GET > DASHBOARD
router.get("/home", adminController.getDashboardAggregation);

// ADMIN > GET > USERS
router.get("/users", adminController.getUsers);

// ADMIN > GET > PRODUCTS
router.get("/products", adminController.getProducts);

// ADMIN > GET > PRODUCT BY ID
router.get("/product/:productId", adminController.getProduct);

// ADMIN > POST > PRODUCT > ADD
router.put(
  "/product/add",
  validatorMiddleware.validateProduct,
  validatorMiddleware.useResult,
  adminController.putProductAdd
);

// ADMIN > POST > PRODUCT > EDIT
router.put(
  "/product/:productId",
  validatorMiddleware.validateProduct,
  validatorMiddleware.useResult,
  adminController.putProductEdit
);

// ADMIN > POST > PRODUCT > DELETE
router.delete("/product/:productId", adminController.deleteProduct);

// ADMIN > GET > ORDERS
router.get("/orders", adminController.getOrders);

// ADMIN > GET > ORDER
router.get("/order/:orderId", adminController.getOrder);

// EXPORT
module.exports = router;
