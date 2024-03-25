// PACKAGE
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// SCHEMA - user
const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  userName: { type: String, required: true },

  // authority: client / admin / cs (custom service)
  role: {
    type: String,
    default: "client",
  },

  // cart
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});

// SCHEMA - METHOD
// ADD TO CART
userSchema.methods.updateQuantityInCart = function (cart, productId, quantity) {
  // copy cart
  const updatedCart = [...cart];

  // find index of product in cart
  const cartProductIndex = updatedCart.findIndex((item) => {
    return item.productId.toString() === productId;
  });

  // check
  if (cartProductIndex === -1) {
    updatedCart.push({ productId, quantity });
  } else {
    updatedCart[cartProductIndex].quantity += quantity;

    // if quantity updated = 0, delete from cart
    if (updatedCart[cartProductIndex].quantity === 0) {
      updatedCart.splice(cartProductIndex, 1);
    }
  }

  // return
  return updatedCart;
};

// DELETE PRODUCT FROM CART
userSchema.methods.removeFromCart = function (cart, productId) {
  // xóa => lọc bỏ theo productId
  const updatedCart = cart.filter((item) => {
    return item.productId.toString() !== productId;
  });

  // return
  return updatedCart;
};

// CHECK CART TO CHECKOUT
userSchema.methods.checkCartToCheckout = function (checkout) {
  // 2 mảng cart chứa các đối tượng
  const array1 = this.cart;
  const array2 = checkout;

  // Hàm so sánh hai đối tượng
  function objectsAreEqual(obj1, obj2) {
    // So sánh các thuộc tính quan trọng
    const isEqualId =
      obj1.productId._id.toString() === obj2.productId._id.toString();
    const isEqualPrice = obj1.productId.price === obj2.productId.price;
    const isEqualQuantity = obj1.quantity === obj2.quantity;

    // Đối tượng sẽ được xem là bằng nhau nếu các thuộc tính cần so sánh bằng nhau
    return isEqualId && isEqualPrice && isEqualQuantity;
  }

  // Hàm so sánh hai mảng
  function arraysAreEqual(arr1, arr2) {
    // Kiểm tra độ dài của hai mảng
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Sử dụng phương thức some và every để so sánh từng đối tượng trong 2 mảng
    // trả về true nếu 2 mảng hoàn toàn giống nhau
    return arr1.every((obj1) =>
      arr2.some((obj2) => objectsAreEqual(obj1, obj2))
    );
  }

  // thực hiện kiểm tra xem 2 mảng có bằng nhau không
  const result = arraysAreEqual(array1, array2);

  return result;
};

// CHECK CART TO CHECKOUT
userSchema.methods.checkCartInStock = function () {
  const result = this.cart.every(
    (item) => item.quantity <= item.productId.count
  );

  return result;
};

// EXPORT
module.exports = mongoose.model("User", userSchema);
