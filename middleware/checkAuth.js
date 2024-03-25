// PACKAGE
const jwt = require("jsonwebtoken");

// EXPORT MIDDLEWARE FUNCTION
// CHECK TOKEN - AUTHENTICATION
module.exports.verifyToken = (req, res, next) => {
  try {
    // get the token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // if no token, return error
    if (!token) return res.status(401).json({ message: "Unauthenticated!" });

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthenticated!" });
      req.user = decoded; // 2 properties: userId, role

      next();
    });

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// CHECK TOKEN - AUTHORITY ADMIN (phân quyền admin)
module.exports.verifyAdmin = (req, res, next) => {
  try {
    // get user information
    const role = req.user.role;

    // check role để phân quyền cho admin
    if (role !== "admin")
      return res.status(403).json({ message: "Unauthorized!" });

    next();

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};

// CHECK TOKEN - AUTHORITY ADMIN AND CUSTOMER SERVICE (phân quyền admin và tư vấn viên)
module.exports.verifyAdminAndCS = (req, res, next) => {
  try {
    // get user
    const role = req.user.role;

    // check role để phân quyền cho admin/cs (customer service)
    if (role !== "admin" && role !== "cs")
      return res.status(403).json({
        message: "Unauthorized!",
        dataError: [{ msg: "Do not have access!" }],
      });

    next();

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};
