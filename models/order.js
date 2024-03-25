// PACKAGE
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// SCHEMA - order
const orderSchema = new Schema({
  // user
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // order items and total (các sản phẩm trong đơn hàng, tổng giá trị)
  items: [
    {
      productId: {
        _id: { type: Schema.Types.ObjectId, required: true },
        // _id: { type: String, required: true },
        category: { type: String, required: true },
        img1: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
      quantity: { type: Number, required: true },
    },
  ],

  total: { type: Number, required: true },

  // order infor (thông tin của khách hàng)
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },

  // status (thời gian đặt, trạng thái của đơn hàng)
  dateCreate: { type: Date, required: true, default: new Date() },
  delivery: {
    type: String,
    required: true,
    default: "Waiting for progressing",
  },
  status: { type: String, required: true, default: "Waiting for pay" },
});

// SCHEMA - METHOD
// GET AVERAGE TOTAL BY MONTH
orderSchema.statics.getAverageByMonth = function () {
  return this.aggregate([
    {
      $addFields: {
        monthYear: {
          $dateToString: { format: "%Y-%m", date: "$dateCreate" },
        },
      },
    },
    {
      $group: {
        _id: "$monthYear",
        totals: { $sum: "$total" },
      },
    },
    {
      $group: {
        _id: null,
        totalsSum: { $sum: "$totals" },
        groupCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        averageTotal: { $divide: ["$totalsSum", "$groupCount"] },
      },
    },
  ]);
};

// GET ORDER BY ID (set trước khi xuất)
orderSchema.statics.getOrderById = async function (res, id) {
  try {
    // fetch by ID
    const order = await this.findById(id);

    if (!order) return res.status(400).json({ message: "Order not found!" });

    return res.status(200).json(order);

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// EXPORT
module.exports = mongoose.model("Order", orderSchema);
