// PACKAGE
const path = require("path");
const multer = require("multer");

// dùng multer xử lý tải tệp lên, fileStorage là xử lý nơi lưu và đặt tên file
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // path tính tương đối từ root folder
    cb(null, path.join("public", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// dùng multer xử lý tải tệp lên, fileFilter là xử lý lọc loại file sẽ nhận
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// set multer
const uploads = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

// EXPORT MIDDLEWARE FUNCTION
// middleware dùng multer
// method .single("image") => trích xuất một tệp duy nhất được lưu trữ trong một trường có tên "image" trong các yêu cầu đến => vào req.file
module.exports.singleImage = uploads.single("image");

// method .array("images, 5") => trích xuất TỐI ĐA 5 tệp được lưu trữ trong một trường có tên "images" trong các yêu cầu đến => vào req.files
// module.exports.multipleImages = uploads.array("images", 5);
module.exports.multipleImages = uploads.array("images");

// khi form không có file
module.exports.noFile = uploads.none();
