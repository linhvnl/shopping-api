// PACKAGE - MODELS - HELPER
const Session = require("./models/session");

// Tạo file socket.js để quản lý kết nối socket.io
const { Server } = require("socket.io");

let io;

// xuất 2 method
module.exports = {
  // method init => khởi tạo và trả về kết nối của socket.io
  init: (httpServer) => {
    // io = require("socket.io")(httpServer); // old
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        // credentials: true,
        // origin: process.env.SOCKET_CLIENT_1,
        // "SOCKET_CLIENT_1": "http://localhost:3000/",
      },
    });
    return io;
  },

  // method getIO => kiểm tra socket.io đã được khởi tạo hay chưa
  getIO: () => {
    // kiểm tra nếu io chưa có thì phản hồi lỗi
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    // trả về kết nối của socket.io để sử dụng
    return io;
  },

  // listen connection from client
  onConnect: () => {
    io.on("connection", (socket) => {
      // Handle khi có connect từ client tới
      // console.log("New client connected" + socket.id);

      // ----- ADMIN -----
      // LOAD ROOMS
      socket.on("load_rooms", async function () {
        try {
          // fetch rooms
          const rooms = await Session.find().select("isNewClientMessage");

          socket.join("admin_room");
          socket.emit("load_rooms", rooms);

          // ------ ERROR -------
        } catch (err) {
          console.log(err);
        }
      });

      // JOIN ROOM
      socket.on("join_room", async function (roomId) {
        try {
          // fetch rooms
          const room = await Session.findById(roomId);

          socket.join(roomId);
          socket.emit("join_room", room);

          // ------ ERROR -------
        } catch (err) {
          console.log(err);
        }
      });

      // NEW MESSAGE FROM ADMIN
      socket.on("new_message_admin", async function ({ roomId, message }) {
        try {
          // fetch rooms
          const updateRoom = await Session.findByIdAndUpdate(
            roomId,
            {
              isNewClientMessage: false,
              $push: { conversation: { message, isAdmin: true } },
            },
            { new: true }
          );

          socket.join(roomId);
          io.to(roomId).emit("update_room", updateRoom);

          // ------ ERROR -------
        } catch (err) {
          console.log(err);
        }
      });

      // ----- CLIENT -----
      // LOAD ROOM
      socket.on("load_room", async function (roomId) {
        try {
          // fetch rooms
          const room = await Session.findById(roomId);

          socket.join(roomId);
          socket.emit("load_room", room);

          // ------ ERROR -------
        } catch (err) {
          console.log(err);
        }
      });

      // CREATE NEW ROOM
      socket.on("create_new_room", async function (message) {
        try {
          // create new room chat
          const newRoom = new Session({ conversation: [{ message }] });
          await newRoom.save();

          socket.join(newRoom._id);
          socket.emit("create_new_room", newRoom);

          // fetch rooms
          const rooms = await Session.find().select("isNewClientMessage");

          io.to("admin_room").emit("load_rooms", rooms);

          // ------ ERROR -------
        } catch (err) {
          console.log(err);
        }
      });

      // NEW MESSAGE FROM CLIENT
      socket.on("new_message", async function ({ roomId, message }) {
        try {
          // fetch rooms
          const updateRoom = await Session.findByIdAndUpdate(
            roomId,
            { isNewClientMessage: true, $push: { conversation: { message } } },
            { new: true }
          );

          socket.join(roomId);
          io.to(roomId).emit("update_room", updateRoom);

          // ------ ERROR -------
        } catch (err) {
          console.log(err);
        }
      });

      // END ROOM
      socket.on("end_room", async (roomId) => {
        try {
          // delete session by roomId
          await Session.findByIdAndDelete(roomId);

          socket.leave(roomId);

          // fetch rooms
          const rooms = await Session.find().select("isNewClientMessage");

          io.to("admin_room").emit("load_rooms", rooms);

          // ------ ERROR -------
        } catch (err) {
          console.log(err);
        }
      });

      // DISCONNECT
      // socket.on("disconnect", () => {
      //   // Khi client disconnect thì log ra terminal
      //   console.log("Client disconnected");
      // });
    });
  },
};
