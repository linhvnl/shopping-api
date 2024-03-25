// PACKAGE
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// SOCKET
const socketIo = require("./socket");

// MIDDLEWARE - USE PACKAGE
const corsMiddleware = require("./middleware/cors");
const bodyParserMiddleware = require("./middleware/bodyParser");
const multerMiddleware = require("./middleware/multer");
const helmetMiddleware = require("./middleware/helmet");

// MIDDLEWARE
const authMiddleware = require("./middleware/checkAuth");

// ROUTERS
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const clientRouter = require("./routes/client");
const adminRouter = require("./routes/admin");
const errorRouter = require("./routes/error");

// CREATE APP SERVER
const app = express();

// SET CORS OPTIONS
app.use(corsMiddleware.useCors);

// USE MIDDLEWARE
app.use(bodyParserMiddleware.useBodyParserURLEncoded);
app.use(bodyParserMiddleware.useBodyParserJSON);
app.use(multerMiddleware.multipleImages);

app.use(helmetMiddleware.useHelmet);

// SERVE STATIC
app.use(express.static(path.join(__dirname, "public")));

// USE ROUTERS
app.use("/products", productRouter);
app.use("/client", authMiddleware.verifyToken, clientRouter);
app.use(
  "/admin",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminRouter
);

app.use(authRouter);

// MIDDLEWARE HANDLE ERRORS
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(status).json({ message });
});

// MIDDLEWARE ROUTE NOT FOUND
app.use(errorRouter);

// CONNECT TO DATABASE and SERVER LISTEN
mongoose
  .connect(process.env.MONGODB)
  .then((result) => {
    console.log("DATABASE CONNECTED!");

    // server listen
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT);
    console.log(`SERVER STARTED ON PORT ${PORT}`);

    // initialize socketIo
    const io = socketIo.init(server);

    // socket connect
    socketIo.onConnect();

    // ------ ERROR -------
  })
  .catch((err) => {
    console.log(err);
  });

//
//
/*
// --------------------------
////////////////////////
// import json to database
const useFileSystem = require("./utils/useFileSystem");
const Product = require("./models/product");

// .then((result) => {
//   const data = useFileSystem.readFile("products.json");
//   data.forEach((item) => {
//     item._id = new mongoose.Types.ObjectId(item._id.$oid);
//   });
//   Product.create(data);
// })

// await Product.updateMany({}, { $set: { count: 10 } });
*/
