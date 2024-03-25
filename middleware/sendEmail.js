// PACKAGE
const nodemailer = require("nodemailer");
const inlineCss = require("inline-css");

// HELPER
// create transporter
const transporter = nodemailer.createTransport({
  service: process.env.SENDMAIL_SERVICE,
  // service: "gmail",
  // host: "smtp.gmail.com",
  // port: 587,
  // secure: false,
  auth: {
    user: process.env.SENDMAIL_USER,
    pass: process.env.SENDMAIL_PASS,
  },
});

// email content <ORDER CONFIRMATION>
const emailHTMLConfirmOrder = function (order) {
  const formatNumber = (number) =>
    new Intl.NumberFormat("vi-VN").format(number);

  return `
<html>
    <head>
        <style>
            /* CSS */
            body {
                background-color: black;
                padding: 16px 32px;
                color: white;
            }

            h1, h2, h3, p {
                color: white;
            }

            table {
                width: 85%;
                border: 1px solid white;
                text-align: center;
            }

            th, td {
                padding: 8px;
                border: 1px solid white;
            }

            img {
                width: 60px;
                height: auto;
            }

        </style>
    </head>
    <body>        
        <h1>Xin chào ${order.fullName}</h1>
        <br />
        <p>Phone: ${order.phoneNumber}</p>
        <p>Address: ${order.address}</p>
        <p>Đơn hàng của bạn đã được đặt thành công vào lúc: ${order.dateCreate.toLocaleDateString(
          "vi-VN"
        )}</p>
        <p>Chi tiết đơn hàng như sau:</p>
        <table>
            <thead>
                <tr>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Hình ảnh</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                ${order.items
                  .map(
                    (item) => `
                    <tr>
                        <td>${item.productId.name}</td>
                        <td style="padding: 0px;" > <img src=${
                          item.productId.img1
                        } alt="product" /></td>
                        <td>${formatNumber(item.productId.price)}</td>
                        <td>${item.quantity}</td>
                        <td>${formatNumber(
                          item.quantity * item.productId.price
                        )}</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
        <h3>Tổng thanh toán:</h3>
        <h3>${formatNumber(order.total)} VND</h3>
        <br />
        <h1>Cảm ơn bạn đã đặt hàng!</h1>
    </body>
</html>
`;
};

// EXPORT
module.exports.confirmOrder = async function (req, res, next) {
  try {
    // request data
    const email = req.sendEmail.email;
    const dataContent = req.sendEmail.dataContent;
    const message = req.sendEmail.message;

    // content of email
    const content = emailHTMLConfirmOrder(dataContent);

    // add Inline CSS into email
    const inlineContent = await inlineCss(content, { url: " " });

    // configuring email
    const mailOptions = {
      from: process.env.SENDMAIL_USER,
      to: email,
      subject: "ORDER CONFIRMATION",
      html: inlineContent,
    };

    // send email
    transporter.sendMail(mailOptions);

    // return response
    return res.status(201).json({ message });

    // ------ ERROR -------
  } catch (err) {
    next(err);
  }
};
