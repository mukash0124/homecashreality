const path = require("node:path");
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/index.html"));
});

app.post("/email", (req, res) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.NODEJS_GMAIL_APP_USER,
      pass: process.env.NODEJS_GMAIL_APP_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let message = {
    from: "", // sender address
    to: "home.cash.reality@mail.ru", // list of receivers
    subject: req.body.name, // Subject line
    html: `
    <ul>
      <li><h1>${req.body.name}</h1></li>
      <li>${req.body.city}</li>
      <li>${req.body.district}</li>
      <li>${req.body.phone}</li>
      <li>${req.body.type}</li>
      <li>${req.body.area}</li>
      <li>${req.body.cash}</li>
    </ul>
    `, // html body
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.redirect("/");
    })
    .catch((err) => {
      return res.status(500).json({ msg: err });
    });
});

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
