// PACKAGE - MODELS - MIDDLEWARES - CONTROLLERS
const express = require("express");

const sendEmailMiddleware = require("../middleware/sendEmail");
const clientController = require("../controllers/client");

// CREATE ROUTER
const router = express.Router();

// ROUTERS
// CLIENT > ACTIVE USER > GET > CART
router.get("/cart", clientController.getCart);

// CLIENT > ACTIVE USER > POST > UPDATE CART
router.post("/cart/update", clientController.postUpdateCart);

// CLIENT > ACTIVE USER > GET > CHECKOUT
router.get("/checkout", clientController.getCheckout);

// CLIENT > ACTIVE USER > POST > ORDER
router.post(
  "/order/create",
  clientController.postCreateOrder,
  sendEmailMiddleware.confirmOrder
);

// CLIENT > ACTIVE USER > GET > ORDERS
router.get("/orders", clientController.getOrders);

// CLIENT > ACTIVE USER > GET > ORDER
router.get("/order/:orderId", clientController.getOrder);

// ---------------------------
// EXPORT
module.exports = router;
