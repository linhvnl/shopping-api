// PACKAGE - MODELS - HELPER
const Product = require("../models/product");

// EXPORT CONTROLERS
// CLIENT > GET > PRODUCTS
module.exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    if (!products)
      return res.status(400).json({ message: "Products not found!" });

    return res.status(200).json(products);

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// CLIENT > GET > DETAIL PRODUCT AND RELATED PRODUCTS (SAME CATEGORY)
module.exports.getProductAndRelated = async (req, res, next) => {
  try {
    // request > body/ query/ params
    const productId = req.params.productId;

    const detailProduct = await Product.findById(productId);

    if (!detailProduct)
      return res.status(400).json({ message: "Product not found!" });

    // fetch related product by category
    const relatedProducts = await Product.find({
      $and: [
        { category: detailProduct.category },
        { _id: { $ne: detailProduct._id } },
      ],
    }).select("name price img1");

    return res.status(200).json({ detailProduct, relatedProducts });

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};
