// PACKAGE
const bodyParser = require("body-parser");

// EXPORT MIDDLEWARE FUNCTION
// json
module.exports.useBodyParserJSON = bodyParser.json();

// url-encoded
module.exports.useBodyParserURLEncoded = bodyParser.urlencoded({
  extended: false,
});
