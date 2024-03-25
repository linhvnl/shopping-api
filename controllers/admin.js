// PACKAGE - MODELS - HELPER
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

const fetchAllDocsAndPaging = require("../utils/fetchAllDocsAndPaging");
const useFileSystem = require("../utils/useFileSystem");

// EXPORT CONTROLERS
// ADMIN > GET > DASHBOARD > SET
module.exports.getDashboardAggregation = async (req, res, next) => {
  // ------- Aggregation for Home Dashboard information
  try {
    // Số lượng tất cả User là client
    const numClientsQuery = User.countDocuments({
      role: "client",
    });

    // Số lượng tất cả Orders
    const numOrdersQuery = Order.estimatedDocumentCount();

    // Doanh thu trung bình hàng tháng của Orders
    // dùng static method thiết lập trên Model Order
    const averageTotalQuery = Order.getAverageByMonth();

    // các Orders gần nhất
    const lastestOrdersQuery = Order.find().sort({ dateCreate: -1 }).limit(8);

    // xử lý fetch dữ liệu
    const results = await Promise.all([
      numClientsQuery,
      numOrdersQuery,
      averageTotalQuery,
      lastestOrdersQuery,
    ]);

    // return response
    return res.status(200).json({
      numClients: results[0],
      numOrders: results[1],
      averageTotal: results[2][0].averageTotal,
      lastestOrders: results[3],
    });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

/////////////////
// ADMIN > GET > USERS
module.exports.getUsers = async (req, res, next) => {
  try {
    // request > body/ query/ params
    // số document trên 1 trang
    const perPage = +req.query.perPage;
    // số trang hiện tại
    const page = +req.query.page;

    // fetch all users and paging
    // dùng HELPER FUNCTIONS chung logic
    await fetchAllDocsAndPaging(res, perPage, page, User, "users");

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

/////////////////
// ADMIN > GET > PRODUCTS
module.exports.getProducts = async (req, res, next) => {
  try {
    // fetch all products
    const products = await Product.find().sort({ category: 1 });

    if (!products)
      return res.status(400).json({ message: "Products not found!" });

    // return response
    return res.status(200).json(products);

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// ADMIN > GET > PRODUCT
module.exports.getProduct = async (req, res, next) => {
  try {
    // request > body/ query/ params
    const productId = req.params.productId;

    // fetch Product by ID
    // (sử dụng methods trên instance, được tạo thêm ở Schema)
    await Product.getProductById(res, productId);

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// ADMIN > POST > PRODUCT > ADD
module.exports.putProductAdd = async (req, res, next) => {
  try {
    // request > body/ query/ params
    const body = req.body;

    // get files with multer
    const images = req.files;

    // validate upload files
    if (!images || images.length === 0)
      return res.status(422).json({
        message: "Validation failed!",
        dataError: [{ msg: "Upload images are none or not valid!" }],
      });

    if (images.length > 5)
      return res.status(422).json({
        message: "Validation failed!",
        dataError: [
          { msg: "Images can only be uploaded to a maximum of 5 files!" },
        ],
      });

    // handle path of upload files
    images.forEach((img, i) => {
      body[`img${i + 1}`] = "/images/" + img.filename;
    });

    // add product
    const newProduct = new Product({ ...body });

    await newProduct.save();

    return res.status(201).json({ message: "New product has been added." });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// ADMIN > POST > PRODUCT > EDIT
module.exports.putProductEdit = async (req, res, next) => {
  try {
    // request > body/ query/ params
    const productId = req.params.productId;

    // edit product - update vào database
    await Product.findByIdAndUpdate(productId, req.body);

    return res.status(200).json({ message: "This product has been edited." });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// ADMIN > POST > PRODUCT > DELETE
module.exports.deleteProduct = async (req, res, next) => {
  try {
    // request > body/ query/ params
    const productId = req.params.productId;

    // fetch product by ID
    const product = await Product.findById(productId);

    if (!product)
      return res.status(400).json({ message: "Product not found!" });

    // delete images of product in data of server
    const imagesPathToDelete = [
      product.img1,
      product.img2,
      product.img3,
      product.img4,
      product.img5,
    ];
    useFileSystem.deleteFile(imagesPathToDelete);

    // delete product
    const result = await Product.findByIdAndDelete(productId);

    if (!result) return res.status(400).json({ message: "Product not found!" });

    return res.status(200).json({ message: "This product has been deleted!" });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

/////////////////
// ADMIN > GET > ORDERS
module.exports.getOrders = async (req, res, next) => {
  try {
    // request > body/ query/ params
    // số document trên 1 trang
    const perPage = +req.query.perPage;
    // số trang hiện tại
    const page = +req.query.page;

    // fetch all orders and paging
    // dùng HELPER FUNCTIONS chung logic
    await fetchAllDocsAndPaging(res, perPage, page, Order, "orders");
    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// ADMIN > GET > ORDER
module.exports.getOrder = async (req, res, next) => {
  try {
    // request > body/ query/ params
    const orderId = req.params.orderId;

    // fetch Product by ID
    // (sử dụng methods trên instance, được tạo thêm ở Schema)
    await Order.getOrderById(res, orderId);

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};
