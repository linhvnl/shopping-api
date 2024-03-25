// HELPER FUNCTION
module.exports = async function (res, perPage, page, MODEL, docName) {
  // logic phân trang
  const skip = (page - 1) * perPage;
  const limit = perPage;

  // fetch docs
  try {
    // Số lượng tất cả Hotels của hệ thống
    const totalDocs = await MODEL.estimatedDocumentCount();

    // fetch docs
    let docs;
    docName === "orders"
      ? (docs = await MODEL.find()
          // .populate("hotel", "name")
          .sort({ dateCreate: -1 })
          .skip(skip)
          .limit(limit))
      : docName === "users"
      ? (docs = await MODEL.find()
          .sort({ fullName: 1 })
          .skip(skip)
          .limit(limit))
      : null;

    // return response error
    if (!docs) return res.status(400).json({ message: "Error" });

    // return response
    return res.status(200).json({
      totalDocs,
      perPage,
      totalPages: Math.ceil(totalDocs / perPage),
      page,
      numDocs: docs.length,
      [docName]: docs,
    });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};

// NOTE sử dụng ở trong controllers
// module.exports.getHotels = async (req, res, next) => {
//   // request > body/ query/ params
//   // số document trên 1 trang
//   const perPage = +req.query.perPage;
//   // số trang hiện tại
//   const page = +req.query.page;

//   // fetch all hotels and paging
//   // dùng HELPER FUNCTIONS chung logic
//   await fetchAllDocsAndPaging(res, perPage, page, Hotel, "hotels");
// };
