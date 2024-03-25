// PACKAGE
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// SCHEMA - product
const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  img1: { type: String, required: true },
  img2: String,
  img3: String,
  img4: String,
  img5: String,
  short_desc: { type: String, required: true },
  long_desc: { type: String, required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true },
});

// SCHEMA - METHOD
// GET PRODUCT BY ID (set trước khi xuất)
productSchema.statics.getProductById = async function (res, id) {
  try {
    // fetch by ID
    const product = await this.findById(id);

    if (!product)
      return res.status(400).json({ message: "Product not found!" });

    return res.status(200).json(product);

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// EXPORT
module.exports = mongoose.model("Product", productSchema);
