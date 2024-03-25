// IMPORT
const fs = require("fs");
const path = require("path");

// HELPER FUNCTION
// read file sync
module.exports.readFile = function (fileName) {
  // tạo biến helper cho path đến file data
  const DATA_PATH = path.join(
    path.dirname(require.main.filename),
    "data",
    fileName
  );
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
};

// HELPER FUNCTION
// delete file
module.exports.deleteFile = function (filePathArray) {
  // delete with every file path in array
  filePathArray.forEach((filePath) => {
    if (filePath) {
      const filePathFull = path.join(__dirname, "..", "public", filePath);
      fs.unlink(filePathFull, (err) => console.log(err));
    }
  });
};
