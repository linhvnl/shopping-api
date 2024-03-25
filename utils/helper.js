// HELPER FUNCTION
// change the string to title case format
module.exports.titleCase = function (string) {
  const result = string
    .toLowerCase()
    .split(" ")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
  return result;
};

// create userName from fullName
module.exports.createUserName = function (fullName) {
  const createStr = fullName
    .split(" ")
    .map((word, i, arr) => (i !== arr.length - 1 ? word[0] : word));

  createStr.unshift(createStr[createStr.length - 1]);
  createStr.pop();

  const userName = createStr.join("");

  return userName;
};

// format date as local string
module.exports.formatLocaleDate = function (date) {
  return date.toLocaleDateString("vi-VN");
};

// format number as local string
module.exports.toUseIntlNumber = function (number) {
  return new Intl.NumberFormat("vi-VN").format(number);
};

// format number order
module.exports.toUseNumOrderCol = function (num) {
  return (num + 1).toString().padStart(2, "0");
};

// format number as local currency
module.exports.toUseIntlCurrency = function (number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

// format render value date range
module.exports.toUseIntlDateRange = function (dateStart, dateEnd) {
  return new Intl.DateTimeFormat("vi-VN").formatRange(
    new Date(dateStart),
    new Date(dateEnd)
  );
};

// NOTE
// QUERY MONGOOSE
/*

// Tổng số lượng khách sạn theo từng loại
let hotelByType = await Hotel.aggregate().group({
  _id: "$type",
  count: { $sum: 1 },
});

// Top 3 khách sạn có rating cao nhất
let hotelTop3Rating = await Hotel.aggregate().sort({ rating: -1 }).limit(3);

// fetch all transactions by username
const transactions = await Transaction.find({
  "user.username": username,
  city: destinationEdit,
})
  .populate("hotel", "name")
  .sort({ dateEnd: -1 });

//  fetch hotels => getHotelsToGetName
const hotels = await Hotel.find({}, "name");

// fetch user information
const user = await User.findOne({ username: username }, "-password -isAdmin");

// fetch hotel và room theo hotelID
const hotel = await Hotel.findById(hotelID, "name rooms").populate("rooms");

// tạo biến result (copy hotel) để lưu kết quả filter
const result = hotel._doc;

// request > body/ query/ params
const { user, dateStart, dateEnd, hotel, room, price, payment } = req.body;

// 1> update user information
const result1 = await User.updateOne({ username: user.username }, { ...user });

// 2> tạo 1 instance transaction mới
const newTransaction = new Transaction({
  ...req.body,
  user: { userId: user._id, username: user.username },
  status: "Booked",
});
const result2 = await newTransaction.save();

// fetch room by ID và hotel của room đó thuộc về
    const room = await Room.findById(roomID);
    // find Hotel của Room này
    const belongHotel = await Hotel.findOne({ rooms: roomID }, "name");
    if (!room || !belongHotel)
      return res.status(400).json({ message: "Error" });
    return res.status(200).json({ room, belongHotel });


*/

/*
// ADMIN > POST > ROOM > DELETE (delete luôn ref room trong hotel)
module.exports.postRoomDelete = async (req, res, next) => {
  // request > body/ query/ params
  const roomID = req.body.roomID;

  // delete room
  try {
    // fetch rooms
    const transaction = await Transaction.findOne({
      "room.roomId": roomID,
    }).lean();

    // return response ALERT
    if (transaction)
      return res.status(400).json({
        message: "ALERT: This room had transactions, so it is not be deleled!",
      });

    // if no transactions found => delele this room
    const result = await Room.findByIdAndDelete(roomID);

    // return response error
    if (!result) return res.status(400).json({ message: "Error" });

    // update Hotel => xóa Room khỏi Hotel
    const updateHotel = await Hotel.updateOne(
      { rooms: roomID },
      { $pull: { rooms: roomID } }
    );

    // return response error
    if (!updateHotel) return res.status(400).json({ message: "Error" });

    // return response
    return res
      .status(200)
      .json({ message: "Handle success: This room has been deleted!" });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// ADMIN > POST > ROOM > ADD (thêm ref room vào hotel)
module.exports.postRoomAdd = async (req, res, next) => {
  // request > body/ query/ params
  const hotelID = req.body.hotelID;
  const roomNumbers = req.body.roomNumbers
    .split(",")
    .map((item) => Number(item));

  // add room
  try {
    // tạo 1 instance room mới
    const newRoom = new Room({ ...req.body, roomNumbers });

    // lưu vào database
    const result = await newRoom.save();

    // return response error
    if (!result) return res.status(400).json({ message: "Error" });

    // update Hotel => add Room vào Hotel
    const updateHotel = await Hotel.updateOne(
      { _id: hotelID },
      { $push: { rooms: result } }
    );

    // return response error
    if (!updateHotel) return res.status(400).json({ message: "Error" });

    // return response success
    return res.status(200).json({ message: "New room has been added." });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};
*/
