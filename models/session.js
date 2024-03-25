// PACKAGE
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// SCHEMA - session
const sessionSchema = new Schema({
  // Tượng trưng cho dữ liệu của một phiên chat với người dùng
  // status khi có tin nhắn mới của client (chưa được admin trả lời)
  isNewClientMessage: {
    type: Boolean,
    required: true,
    default: true,
  },
  conversation: [
    {
      isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
      message: { type: String, required: true },
    },
  ],
});

// EXPORT
module.exports = mongoose.model("Session", sessionSchema);
