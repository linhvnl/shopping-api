// EXPORT CONTROLERS
// ERROR 404: ROUTE NOT FOUND
module.exports.get404 = (req, res, next) => {
  return res.status(404).json({ message: "Route not found" });
};
