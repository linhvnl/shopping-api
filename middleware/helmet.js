// PACKAGE
const helmet = require("helmet");

// EXPORT MIDDLEWARE FUNCTION
// module.exports.useHelmet = helmet();

// module.exports.useHelmet = helmet({
//   crossOriginResourcePolicy: false,
// });

// để cung cấp tệp tĩnh cần thiết lập về cross-origin
module.exports.useHelmet = helmet.crossOriginResourcePolicy({
  policy: "cross-origin",
});
