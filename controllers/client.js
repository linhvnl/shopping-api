// PACKAGE - MODELS - HELPER
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

// EXPORT CONTROLERS

// CLIENT > ACTIVE USER > GET > CART
module.exports.getCart = async (req, res, next) => {
  try {
    // token trong req.user > 2 properties: userId, role
    const userId = req.user.userId;

    // fetch User by ID
    const user = await User.findById(userId, "cart").populate("cart.productId");

    if (!user) return res.status(400).json({ message: "Cart not found!" });

    return res.status(200).json(user.cart);

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// CLIENT > ACTIVE USER > POST > ADD PRODUCT TO CART
module.exports.postUpdateCart = async (req, res, next) => {
  try {
    // token trong req.user > 2 properties: userId, role
    const userId = req.user.userId;

    // request > body/ query/ params
    const { action, productId, quantity } = req.body;

    // fetch User by ID
    const user = await User.findById(userId, "cart");

    if (!user) return res.status(400).json({ message: "User not found!" });

    // update cart
    const updatedCart =
      action === "DELETE"
        ? user.removeFromCart(user.cart, productId)
        : user.updateQuantityInCart(user.cart, productId, quantity);

    // save updatedCart to user and database
    user.cart = updatedCart;
    await user.save();

    return res.status(200).json({ message: "Cart updated!" });

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// CLIENT > ACTIVE USER > GET > CHECKOUT
module.exports.getCheckout = async (req, res, next) => {
  try {
    // token trong req.user > 2 properties: userId, role
    const userId = req.user.userId;

    // fetch User by ID
    const user = await User.findById(userId, "-password -role").populate(
      "cart.productId"
    );

    if (!user) return res.status(400).json({ message: "Data not found!" });

    return res.status(200).json(user);

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// CLIENT > ACTIVE USER > POST > ORDER
module.exports.postCreateOrder = async (req, res, next) => {
  try {
    // token trong req.user > 2 properties: userId, role
    const userId = req.user.userId;

    // request > body/ query/ params
    const checkout = req.body.checkout;

    // fetch User by ID
    const user = await User.findById(userId).populate("cart.productId");

    if (!user || !user.cart.length)
      return res.status(400).json({ message: "No products in your cart!" });

    // thực hiện kiểm tra cart khớp với checkout
    const result1 = user.checkCartToCheckout(checkout);
    // thực hiện kiểm tra count đủ cho cart
    const result2 = user.checkCartInStock();

    if (!result1 || !result2) {
      return res.status(400).json({
        message:
          "Some products in your cart have been update! Please check your cart again!",
      });
    }

    // total of cart
    const total = user.cart.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    // update count in products
    await Promise.all(
      user.cart.map(async (item) => {
        await Product.findByIdAndUpdate(item.productId._id, {
          $inc: { count: -item.quantity },
        });
      })
    );

    // create order
    const newOrder = new Order({
      userId: user._id,
      items: user.cart,
      total,
      ...req.body,
    });

    await newOrder.save();

    // update cart
    user.cart = [];
    await user.save();

    // send data to the next middleware to send email to user
    req.sendEmail = {
      email: user.email,
      dataContent: newOrder,
      message: "Order created!",
    };
    next();

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// CLIENT > ACTIVE USER > GET > ORDERS
module.exports.getOrders = async (req, res, next) => {
  try {
    // token trong req.user > 2 properties: userId, role
    const userId = req.user.userId;

    // fetch order by ID
    const orders = await Order.find({ userId }).sort({ dateCreate: -1 });

    if (!orders) return res.status(400).json({ message: "Orders not found!" });

    return res.status(200).json(orders);

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// CLIENT > ACTIVE USER > GET > ORDER
module.exports.getOrder = async (req, res, next) => {
  try {
    // token trong req.user > 2 properties: userId, role
    const userId = req.user.userId;

    // request > body/ query/ params
    const orderId = req.params.orderId;

    // fetch order by ID
    const order = await Order.find({ _id: orderId, userId });

    if (!order.length)
      return res.status(400).json({ message: "Order not found!" });

    return res.status(200).json(order[0]);

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};
